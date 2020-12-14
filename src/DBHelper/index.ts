import { PCRDB, PCRStoreValue } from '../db';
import { getAllInit } from './init';
import { getRarityData, RarityData } from './rarity';
import { getPromotionStatusData, PromotionStatusData } from './promotion_status';
import { getUnitSkillData, UnitSkillData } from './skill';
import { getEquipData, EquipData } from './equip';
import { getUniqueEquipData, UniqueEquipData } from './unique_equip';
import { getPromotionData, PromotionData } from './promotion';
import { getStoryStatusData, StoryStatusMemo, StoryStatusData } from './story_status';
import { getEquipCraft, EquipCraft } from './equip_craft';
import { getQuestList, QuestData } from './quest';
import { plus, Property } from './property';
import ImageData from './ImageData';
import maxUserProfile, { nullID } from './maxUserProfile';
import { getEquipRarity, getEquipGenreID, deepClone, mapQuestType, Range } from './helper';
import Big from 'big.js';

export type PropertyData = [RarityData, PromotionStatusData, PromotionData, StoryStatusData, UniqueEquipData | undefined];

export interface CharaBaseData {
  charaData: PCRStoreValue<'chara_data'>;
  userProfile: PCRStoreValue<'user_profile'>;
  propertyData: PropertyData;
  getPosition(): number;
  getProperty(userProfile?: PCRStoreValue<'user_profile'>, propertyData?: PropertyData): Property<Big>;
}

export interface CharaDetailData extends CharaBaseData {
  unitProfile: PCRStoreValue<'unit_profile'>;
  unitSkillData: UnitSkillData;
  promotions: PromotionData[];
}

export interface EquipDetailData {
  equipData?: EquipData;
  uniqueEquipData?: UniqueEquipData;
  enhanceLevel?: number;
  onChangeEnhance?: (enhanceLevel: number) => void;
}

export type EquipMaterialData = [string/*rarity*/, { equip_id: number; genre_id: string; }[]];

export function getCharaProperty(userProfile: PCRStoreValue<'user_profile'>, propertyData: PropertyData): Property<Big> {
  const { level, promotion_level, equip_enhance_status, love_level_status, unique_enhance_level } = userProfile;
  const [rarityData, promotionStatusData, promotionData, storyStatus, uniqueEquipData] = propertyData;
  return plus([
    rarityData.getProperty(level, promotion_level),
    promotionStatusData.getProperty(),
    promotionData.getProperty(equip_enhance_status),
    storyStatus.getProperty(love_level_status),
    uniqueEquipData && uniqueEquipData.getProperty(unique_enhance_level)
  ]);
}

function getPosition(this: CharaBaseData): number {
  const { search_area_width } = this.charaData;
  return search_area_width < 300 ? 1 : search_area_width > 600 ? 3 : 2;
}

function getProperty(this: CharaBaseData): Property<Big> {
  return getCharaProperty(this.userProfile, this.propertyData);
}

class DBHelper extends ImageData {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(db: PCRDB) {
    super(db);
    // this._writeMapRange();
  }

  // private async _writeMapRange() {
  //   const rarities = ['11', '21', '22', '23', '24', '31', '32', '33', '34', '41', '42', '43', '44', '51', '52', '53', '54', '55', '56', '57', '61', '62'];
  //   const types = ['N', 'H', 'VH'] as const;
  //   const lists = await Promise.all(types.map(type => this.getQuestList(mapQuestType(type))));
  //   const mapRange: Record<string, Range | undefined> = {};
  //   for (let i = 0; i < types.length; i++) {
  //     const list = lists[i];
  //     const type = types[i];
  //     for (let rarity of rarities) {
  //       const questIds: number[] = [];
  //       for (let item of list) {
  //         if (item.drop_data.drop_reward.some(value => rarity === getEquipRarity(value.reward_id.toString()))) {
  //           questIds.push(item.quest_id);
  //         }
  //       }
  //       if (questIds.length > 0) {
  //         mapRange[type + rarity] = [Math.min(...questIds), Math.max(...questIds)];
  //       }
  //     }
  //   }
  //   console.log(JSON.stringify(mapRange).replaceAll('"', "'"));
  // }

  async getCharaDetailData(unit_id: number, user_name: string, base?: CharaBaseData): Promise<CharaDetailData | undefined> {
    const [charaData, userProfile, unitProfile, promotions, unitSkillData] = await Promise.all([
      base ? base.charaData : this.db.transaction('chara_data', 'readonly').store.get(unit_id),
      base ? deepClone(base.userProfile) : this.db.transaction('user_profile', 'readonly').store.get([user_name, unit_id]),
      this.db.transaction('unit_profile', 'readonly').store.get(unit_id),
      this.getPromotions(unit_id),
      getUnitSkillData(this.db, unit_id),
    ]).catch(() => []);
    if (!userProfile || !charaData) {
      const count = await this.db.transaction('chara_data', 'readonly').store.count();
      if (count > 0) return undefined;
      return this.getAllCharaBaseData(user_name).then(list => ({
        ...list.find(item => item.charaData.unit_id === unit_id)!,
        unitProfile: unitProfile!,
        unitSkillData: unitSkillData!,
        promotions: promotions!,
      }));
    }
    const propertyData = base ? [...base.propertyData] as PropertyData : await this.getCharaPropertyData(charaData.unique_equip_id, userProfile);
    return {
      charaData,
      userProfile,
      propertyData,
      unitProfile: unitProfile!,
      unitSkillData: unitSkillData!,
      promotions: promotions!,
      getPosition,
      getProperty,
    };
  }

  async getAllCharaBaseData(user_name: string): Promise<CharaBaseData[]> {
    let [allCharaData, userProfiles] = await Promise.all([
      this.db.transaction('chara_data', 'readonly').store.getAll(),
      this.db.transaction('user_profile', 'readonly').store.index('user_profile_0_user_name').getAll(user_name)
    ]);
    const memo = {};
    if (allCharaData.length < 1 || userProfiles.length < 1) {
      [allCharaData, userProfiles] = await getAllInit(this.db, user_name);
      this.setAllCharaData(allCharaData);
      this.setUserProfiles(userProfiles);
    }
    const promiseArr: Promise<CharaBaseData>[] = [];
    for (let i = 0; i < userProfiles.length; i++) {
      const userProfile = userProfiles[i];
      const charaData = allCharaData.find(item => item.unit_id === userProfile.unit_id)!;
      promiseArr.push(this.getCharaPropertyData(charaData.unique_equip_id, userProfile, memo).then(propertyData => {
        return {
          charaData,
          userProfile,
          propertyData,
          getPosition,
          getProperty,
        };
      }));
    }
    return Promise.all(promiseArr);
  }

  getCharaPropertyData(uniqueEquipID: number, userProfile: PCRStoreValue<'user_profile'>, memo?: StoryStatusMemo): Promise<PropertyData> {
    const { unit_id, rarity, promotion_level } = userProfile;
    return Promise.all([
      getRarityData(this.db, unit_id, rarity),
      getPromotionStatusData(this.db, unit_id, promotion_level),
      getPromotionData(this.db, unit_id, promotion_level),
      getStoryStatusData(this.db, unit_id, memo),
      uniqueEquipID !== nullID ? getUniqueEquipData(this.db, unit_id, uniqueEquipID) : undefined
    ]);
  }

  getRarityData(unit_id: number, rarity: number): Promise<RarityData> {
    return getRarityData(this.db, unit_id, rarity);
  }

  getPromotionStatusData(unit_id: number, promotion_level: number): Promise<PromotionStatusData> {
    return getPromotionStatusData(this.db, unit_id, promotion_level);
  }

  getEquipData(equipment_id: number): Promise<EquipData | undefined> {
    return getEquipData(this.db, equipment_id).catch(() => undefined);
  }

  getUniqueEquipData(unique_equip_id: number): Promise<UniqueEquipData | undefined> {
    return getUniqueEquipData(this.db, 0, unique_equip_id).catch(() => undefined);
  }

  getEquipCraft(equipment_id: number): Promise<EquipCraft> {
    return getEquipCraft(this.db, equipment_id);
  }

  getQuestList(range: Range): Promise<QuestData[]>;
  getQuestList(ranges: Range[]): Promise<QuestData[][]>
  getQuestList(arg: Range | Range[]): Promise<QuestData[] | QuestData[][]> {
    return getQuestList(this.db, arg as any);
  }

  setUserProfile(userProfile: PCRStoreValue<'user_profile'>): Promise<void> {
    return this.db.transaction('user_profile', 'readwrite').store.put(userProfile) as any;
  }

  getAllUser(): Promise<string[]> {
    return this.db.transaction('user_profile', 'readonly').store.getAllKeys().then(keys => {
      const allUser: string[] = [];
      for (let key of keys) {
        const user = key[0];
        if (allUser.indexOf(user) < 0) {
          allUser.push(user);
        }
      }
      return allUser;
    });
  }

  update(): Promise<boolean> {
    return getAllInit(this.db, maxUserProfile.user_name).then(([allCharaData, userProfiles]) => {
      return Promise.all([
        this.setAllCharaData(allCharaData),
        this.setUserProfiles(userProfiles)
      ]).then(() => true);
    });
  }

  getPromotionData(unit_id: number, promotion_level: number): Promise<PromotionData> {
    return getPromotionData(this.db, unit_id, promotion_level);
  }

  getPromotions(unit_id: number): Promise<PromotionData[]> {
    const promiseArr: Promise<PromotionData>[] = [];
    let promotionLevel = maxUserProfile.promotion_level;
    while(promotionLevel > 0) {
      promiseArr.push(getPromotionData(this.db, unit_id, promotionLevel));
      promotionLevel--;
    }
    return Promise.all(promiseArr);
  }

  async getAllEquipMaterial(): Promise<EquipMaterialData[]> {
    const equipments = await this.db.transaction('equipment_data', 'readonly').store.getAll(IDBKeyRange.upperBound(140000, true));
    const result: EquipMaterialData[] = [];
    for (let item of equipments) {
      if (item.craft_flg === 0) {
        const equip_id = item.equipment_id;
        const idStr = item.equipment_id.toString();
        const rarity = getEquipRarity(idStr);
        const genre_id = getEquipGenreID(idStr);
        const findItem = result.find(value => value[0] === rarity);
        if (findItem) findItem[1].push({ equip_id, genre_id });
        else result.push([rarity, [{ equip_id, genre_id }]]);
      }
    }
    for (let item of result) {
      item[1] = item[1].sort((a: any, b: any) => a.genre_id - b.genre_id);
    }
    return result;
  }

  async getAllMemoryPiece(): Promise<number[]> {
    const tx = this.db.transaction('quest_data', 'readonly');
    const hRange = mapQuestType('H');
    const vhRange = mapQuestType('VH');
    const [hQuestList, vhQuestList] = await Promise.all([
      tx.store.getAll(IDBKeyRange.bound(hRange[0], hRange[1])),
      tx.store.getAll(IDBKeyRange.bound(vhRange[0], vhRange[1]))
    ]);
    const resultSet: Set<number> = new Set();
    for (let item of hQuestList) {
      resultSet.add(item.reward_image_1);
    }
    for (let item of vhQuestList) {
      if (item.reward_image_1 > 0) {
        resultSet.add(item.reward_image_1);
      }
    }
    return [...resultSet];
  }

  setAllCharaData(allCharaData: PCRStoreValue<'chara_data'>[]): Promise<void> {
    const tx = this.db.transaction('chara_data', 'readwrite');
    const promiseArr = [];
    allCharaData.forEach(record => promiseArr.push(tx.store.put(record)));
    promiseArr.push(tx.done);
    return Promise.all(promiseArr) as any;
  }

  setUserProfiles(userProfiles: PCRStoreValue<'user_profile'>[]): Promise<void> {
    const tx = this.db.transaction('user_profile', 'readwrite');
    const promiseArr = [];
    userProfiles.forEach(record => promiseArr.push(tx.store.put(record)));
    promiseArr.push(tx.done);
    return Promise.all(promiseArr) as any;
  }

  async deleteUserProfiles(userName: string): Promise<void> {
    const store = this.db.transaction('user_profile', 'readwrite').store;
    const keys = await store.index('user_profile_0_user_name').getAllKeys(userName);
    const promiseArr: Promise<void>[] = [];
    keys.forEach(key => promiseArr.push(store.delete(key)));
    await Promise.all(promiseArr);
  }
}

export default DBHelper;
