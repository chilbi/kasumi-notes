import { PCRDB, PCRStoreValue } from '../db';
import { SkillEnhanceStatus } from './skill';
import { getPromotionData, EquipEnhanceStatus } from './promotion';
import { StoryStatusMemo, getStoryStatusData, LoveLevelStatus } from './story_status';
import maxUserProfile, { nullID } from './maxUserProfile';

async function getInit(db: PCRDB, user_name: string, unit_id: number, memo?: StoryStatusMemo): Promise<[PCRStoreValue<'chara_data'>, PCRStoreValue<'user_profile'>]> {
  const tx = db.transaction(['unit_data', 'actual_unit_background', 'unit_rarity', 'unit_unique_equip'], 'readonly');
  const [charaData, userProfile] = await Promise.all([
    Promise.all([
      tx.objectStore('unit_data').get(unit_id),
      tx.objectStore('actual_unit_background').get(unit_id),
      tx.objectStore('unit_rarity').index('unit_rarity_0_unit_id').count(unit_id),
      tx.objectStore('unit_unique_equip').get(unit_id)
    ]).then(([unitData, actualUnitBackground, maxRarity, unitUniqueEquip]) => {
      if (!unitData) throw new Error(`objectStore('unit_data').get(/*unit_id*/${unit_id}) => undefined`);
      // if (!actualUnitBackground) throw new Error(`objectStore('actual_unit_background').get(/*equipment_id*/${unit_id}) => undefined`);
      return {
        unit_id,
        unit_name: unitData.unit_name,
        kana: unitData.kana,
        actual_name: actualUnitBackground ? actualUnitBackground.unit_name : unitData.kana || unitData.unit_name,
        min_rarity: unitData.rarity,
        max_rarity: maxRarity,
        unique_equip_id: unitUniqueEquip ? unitUniqueEquip.equip_id : nullID,
        search_area_width: unitData.search_area_width,
        atk_type: unitData.atk_type,
        normal_atk_cast_time: unitData.normal_atk_cast_time,
        comment: unitData.comment,
      } as PCRStoreValue<'chara_data'>;
    }),

    Promise.all([
      getPromotionData(db, unit_id, maxUserProfile.promotion_level),
      getStoryStatusData(db, unit_id, memo)
    ]).then(([promotionData, storyStatusData]) => {
      const skill_enhance_status: SkillEnhanceStatus = {
        ub: maxUserProfile.level,
        1: maxUserProfile.level,
        2: maxUserProfile.level,
        ex: maxUserProfile.level,
      };
      const equip_enhance_status: EquipEnhanceStatus = {};
      for (let i = 0; i < 6; i++) {
        const slot = promotionData.equip_slots[i];
        equip_enhance_status[i] = slot ? slot.max_enhance_level : -1;
      }
      const love_level_status: LoveLevelStatus = {};
      love_level_status[storyStatusData.self_story.chara_id] = storyStatusData.self_story.max_love_level;
      for (let shareStory of storyStatusData.share_stories) {
        love_level_status[shareStory.chara_id] = shareStory.max_love_level;
      }
      return {
        user_name,
        unit_id,
        level: maxUserProfile.level,
        rarity: 5,
        promotion_level: maxUserProfile.promotion_level,
        skill_enhance_status,
        equip_enhance_status,
        love_level_status,
        unique_enhance_level: 0,
      } as PCRStoreValue<'user_profile'>;
    })
  ]);

  userProfile.rarity = charaData.max_rarity;
  userProfile.unique_enhance_level = charaData.unique_equip_id === nullID ? 0 : maxUserProfile.unique_enhance_level;
  return [charaData, userProfile];
}

export function getAllInit(db: PCRDB, user_name: string, memo?: StoryStatusMemo): Promise<[PCRStoreValue<'chara_data'>[], PCRStoreValue<'user_profile'>[]]> {
  return db.transaction('unit_profile', 'readonly').store.getAllKeys().then(keys => {
    const allCharaData: PCRStoreValue<'chara_data'>[] = [];
    const userProfiles: PCRStoreValue<'user_profile'>[] = [];
    const promiseArr = [];
    for (let unit_id of keys) {
      promiseArr.push(getInit(db, user_name, unit_id, memo).then(([charaData, userProfile]) => {
        allCharaData.push(charaData);
        userProfiles.push(userProfile);
      }));
    }
    return Promise.all(promiseArr).then(() => [allCharaData, userProfiles]);
  });
}
