import { PCRDB, PCRStoreValue } from '../db';
import { getAllInit } from './init';
import { getRarityData, RarityData } from './rarity';
import { getPromotionStatusData, PromotionStatusData } from './promotion_status';
import { getUnitSkillData, UnitSkillData } from './skill';
import { getUniqueEquipData, UniqueEquipData } from './unique_equip';
import { getPromotionData, PromotionData } from './promotion';
import { getStoryStatusData, StoryStatusMemo, StoryStatusData } from './story_status';
import { getEquipCraft, EquipCraft } from './equip_craft';
import { getQuestList, QuestData } from './quest';
import { plus, Property } from './property';
import ImageData from './ImageData';
import maxUserProfile from './maxUserProfile';
import { Range } from './helper';
import Big from 'big.js';

export type PropertyData = [RarityData, PromotionStatusData, PromotionData, StoryStatusData, UniqueEquipData | undefined];

export interface CharaBaseData {
  charaData: PCRStoreValue<'chara_data'>;
  userProfile: PCRStoreValue<'user_profile'>;
  propertyData: PropertyData;
  getPosition(): number;
  getProperty(): Property<Big>;
}

export interface CharaDetailData extends CharaBaseData {
  unitProfile: PCRStoreValue<'unit_profile'>;
  unitSkillData: UnitSkillData;
  promotions: PromotionData[];
}

function getPosition(this: CharaBaseData): number {
  return this.charaData.search_area_width < 360 ? 1 : this.charaData.search_area_width > 590 ? 3 : 2;
}

function getProperty(this: CharaBaseData): Property<Big> {
  const { level, promotion_level, equip_enhance_status, love_level_status, unique_enhance_level } = this.userProfile;
  const [rarityData, promotionStatusData, promotionData, storyStatus, uniqueEquipData] = this.propertyData;
  return plus([
    rarityData.getProperty(level, promotion_level),
    promotionStatusData.getProperty(),
    promotionData.getProperty(equip_enhance_status),
    storyStatus.getProperty(love_level_status),
    uniqueEquipData && uniqueEquipData.getProperty(unique_enhance_level)
  ]);
}

class DBHelper extends ImageData {
  readonly default_user = 'MAX';

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(db: PCRDB) {
    super(db);
  }

  async getCharaDetailData(unit_id: number, user_name = this.default_user): Promise<CharaDetailData | undefined> {
    const [charaData, userProfile, unitProfile, promotions, unitSkillData] = await Promise.all([
      this.db.transaction('chara_data', 'readonly').store.get(unit_id),
      this.db.transaction('user_profile', 'readonly').store.get([user_name, unit_id]),
      this.db.transaction('unit_profile', 'readonly').store.get(unit_id),
      this.getPromotions(unit_id),
      getUnitSkillData(this.db, unit_id),
    ]).catch(() => []);
    if (!userProfile || !charaData) {
      const count = await this.db.transaction('chara_data', 'readonly').store.count();
      if (count > 0) return undefined;
      return this.getAllCharaBaseData().then(list => ({
        ...list.find(item => item.charaData.unit_id === unit_id)!,
        unitProfile: unitProfile!,
        unitSkillData: unitSkillData!,
        promotions: promotions!,
      }));
    }
    const propertyData = await this.getCharaPropertyData(userProfile);
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

  async getAllCharaBaseData(user_name = this.default_user): Promise<CharaBaseData[]> {
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
      promiseArr.push(this.getCharaPropertyData(userProfile, memo).then(propertyData => {
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

  getCharaPropertyData(userProfile: PCRStoreValue<'user_profile'>, memo?: StoryStatusMemo): Promise<PropertyData> {
    const { unit_id, rarity, promotion_level, unique_equip_id, unique_enhance_level } = userProfile;
    return Promise.all([
      getRarityData(this.db, unit_id, rarity),
      getPromotionStatusData(this.db, unit_id, promotion_level),
      getPromotionData(this.db, unit_id, promotion_level),
      getStoryStatusData(this.db, unit_id, memo),
      unique_enhance_level > 0 ? getUniqueEquipData(this.db, unit_id, unique_equip_id) : undefined
    ]);
  }

  getRarityData(unit_id: number, rarity: number): Promise<RarityData> {
    return getRarityData(this.db, unit_id, rarity);
  }

  getPromotionStatusData(unit_id: number, promotion_level: number): Promise<PromotionStatusData> {
    return getPromotionStatusData(this.db, unit_id, promotion_level);
  }

  getEquipCraft(equipment_id: number): Promise<EquipCraft> {
    return getEquipCraft(this.db, equipment_id);
  }

  getQuestList(range: Range): Promise<QuestData[]>;
  getQuestList(ranges: Range[]): Promise<QuestData[][]>
  getQuestList(arg: Range | Range[]): Promise<QuestData[] | QuestData[][]> {
    return getQuestList(this.db, arg as any);
  }

  protected getPromotions(unit_id: number): Promise<PromotionData[]> {
    const promiseArr: Promise<PromotionData>[] = [];
    let promotionLevel = maxUserProfile.promotion_level;
    while(promotionLevel > 0) {
      promiseArr.push(getPromotionData(this.db, unit_id, promotionLevel));
      promotionLevel--;
    }
    return Promise.all(promiseArr);
  }

  protected setAllCharaData(allCharaData: PCRStoreValue<'chara_data'>[]): Promise<void> {
    const tx = this.db.transaction('chara_data', 'readwrite');
    const promiseArr = [];
    allCharaData.forEach(record => promiseArr.push(tx.store.put(record)));
    promiseArr.push(tx.done);
    return Promise.all(promiseArr) as any;
  }

  protected setUserProfiles(userProfiles: PCRStoreValue<'user_profile'>[]): Promise<void> {
    const tx = this.db.transaction('user_profile', 'readwrite');
    const promiseArr = [];
    userProfiles.forEach(record => promiseArr.push(tx.store.put(record)));
    promiseArr.push(tx.done);
    return Promise.all(promiseArr) as any;
  }
}

export default DBHelper;
