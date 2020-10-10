import { PCRDB, PCRStoreValue } from '../db';
import { getAllInit } from './init';
import { getRarityData, RarityData } from './rarity';
import { getPromotionStatusData, PromotionStatusData } from './promotion_status';
import { getUnitSkillData, UnitSkillData } from './skill';
import { getUniqueEquipData, UniqueEquipData } from './unique_equip';
import { getPromotionData, PromotionData } from './promotion';
import { getStoryStatusData, StoryStatusMemo, StoryStatusData } from './story_status';
import { plus, Property } from './property';
import ImageData from './ImageData';

export type PropertyData = [RarityData, PromotionStatusData, PromotionData, StoryStatusData, UniqueEquipData | undefined];

export interface CharaBaseData {
  charaData: PCRStoreValue<'chara_data'>;
  userProfile: PCRStoreValue<'user_profile'>;
  propertyData: PropertyData;
  getProperty(): Property;
}

export interface CharaDetailData extends CharaBaseData {
  charaProfile: PCRStoreValue<'unit_profile'>;
  charaPromotions: PromotionData[];
  charaSkillData: UnitSkillData;
}

export function getCharaProperty(this: CharaBaseData): Property {
  const { level, promotion_level, equip_enhance_status, love_level_status, unique_enhance_level } = this.userProfile;
  const [rarityData, promotionStatusData, promotionData, storyStatus, uniqueEquipData] = this.propertyData;
  return plus([
    rarityData.getProperty(level, promotion_level),
    promotionStatusData.getProperty(),
    promotionData.getProperty(equip_enhance_status),
    storyStatus.getProperty(love_level_status),
    uniqueEquipData?.getProperty(unique_enhance_level)
  ]);
}

class DBHelper extends ImageData {
  readonly default_user = 'MAX';
  readonly max_level = 175;
  readonly max_promotion_level = 18;
  readonly max_unique_enhance_level = 180;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(db: PCRDB) {
    super(db);
  }

  async getCharaDetailData(unit_id: number, user_name = this.default_user): Promise<CharaDetailData | undefined> {
    const [charaData, userProfile, unitProfile, charaPromotions, charaSkillData] = await Promise.all([
      this.db.transaction('chara_data', 'readonly').store.get(unit_id),
      this.db.transaction('user_profile', 'readonly').store.get([user_name, unit_id]),
      this.db.transaction('unit_profile', 'readonly').store.get(unit_id),
      this.getCharaPromotions(unit_id),
      getUnitSkillData(this.db, unit_id),
    ]);
    if (!userProfile || !charaData) {
      const count = await this.db.transaction('chara_data', 'readonly').store.count();
      if (count > 0) return undefined;
      return this.getAllCharaBaseData().then(list => ({
        ...list.find(item => item.charaData.unit_id === unit_id)!,
        charaProfile: unitProfile!,
        charaPromotions,
        charaSkillData,
      }));
    }
    const propertyData = await this.getCharaPropertyData(userProfile);
    const data = {} as CharaDetailData;
    data.charaData = charaData;
    data.userProfile = userProfile;
    data.propertyData = propertyData;
    data.charaProfile = unitProfile!;
    data.charaPromotions = charaPromotions;
    data.charaSkillData = charaSkillData;
    data.getProperty = getCharaProperty.bind(data);
    return data;
  }

  async getAllCharaBaseData(user_name = this.default_user): Promise<CharaBaseData[]> {
    let [allCharaData, userProfiles] = await Promise.all([
      this.db.transaction('chara_data', 'readonly').store.getAll(),
      this.db.transaction('user_profile', 'readonly').store.index('user_profile_0_user_name').getAll(user_name)
    ]);
    const memo = {};
    if (allCharaData.length < 1 || userProfiles.length < 1) {
      [allCharaData, userProfiles] = await getAllInit(
        this.db,
        user_name,
        this.max_level,
        this.max_promotion_level,
        this.max_unique_enhance_level
      );
      this.setAllCharaData(allCharaData);
      this.setUserProfiles(userProfiles);
    }
    const promiseArr: Promise<CharaBaseData>[] = [];
    for (let i = 0; i < userProfiles.length; i++) {
      const userProfile = userProfiles[i];
      const charaData = allCharaData.find(item => item.unit_id === userProfile.unit_id)!;
      promiseArr.push(this.getCharaPropertyData(userProfile, memo).then(propertyData => {
        const data = {} as CharaBaseData;
        data.charaData = charaData;
        data.userProfile = userProfile;
        data.propertyData = propertyData;
        data.getProperty = getCharaProperty.bind(data);
        return data;
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

  protected getCharaPromotions(unit_id: number): Promise<PromotionData[]> {
    const promiseArr: Promise<PromotionData>[] = [];
    let promotionLevel = this.max_promotion_level;
    while(promotionLevel > 0) {
      promiseArr.push(getPromotionData(this.db, unit_id, promotionLevel));
      promotionLevel--;
    }
    return Promise.all(promiseArr);
  }

  protected setAllCharaData(allCharaData: PCRStoreValue<'chara_data'>[]): Promise<void> {
    console.log('1 chi setAllCharaData')
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
