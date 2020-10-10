import { PCRDB, PCRStoreValue } from '../db';
import { SkillEnhanceStatus } from './skill';
import { getPromotionData, EquipEnhanceStatus } from './promotion';
import { StoryStatusMemo, getStoryStatusData, LoveLevelStatus } from './story_status';

async function getInit(
  db: PCRDB,
  user_name: string,
  unit_id: number,
  max_level: number,
  max_promotion_level: number,
  max_unique_enhance_level: number,
  memo?: StoryStatusMemo
): Promise<[PCRStoreValue<'chara_data'>, PCRStoreValue<'user_profile'>]> {
  const tx = db.transaction(['unit_data', 'actual_unit_background', 'unit_rarity', 'unit_unique_equip'], 'readonly');
  const [charaData, userProfile, unitRarityCount] = await Promise.all([
    Promise.all([
      tx.objectStore('unit_data').get(unit_id),
      tx.objectStore('actual_unit_background').get(unit_id),
    ]).then(([unitData, actualUnitBackground]) => {
      if (!unitData) throw new Error(`objectStore('unit_data').get(/*unit_id*/${unit_id}) => undefined`);
      // if (!actualUnitBackground) throw new Error(`objectStore('actual_unit_background').get(/*equipment_id*/${unit_id}) => undefined`);
      return {
        unit_id,
        unit_name: unitData.unit_name,
        kana: unitData.kana,
        actual_name: actualUnitBackground ? actualUnitBackground.unit_name : unitData.kana || unitData.unit_name,
        min_rarity: unitData.rarity,
        max_rarity: 0,
        search_area_width: unitData.search_area_width,
        position: unitData.search_area_width < 360 ? 1 : unitData.search_area_width > 590 ? 3 : 2,
        atk_type: unitData.atk_type,
        normal_atk_cast_time: unitData.normal_atk_cast_time,
        comment: unitData.comment,
      } as PCRStoreValue<'chara_data'>;
    }),

    Promise.all([
      tx.objectStore('unit_unique_equip').get(unit_id),
      getPromotionData(db, unit_id, max_promotion_level),
      getStoryStatusData(db, unit_id, memo)
    ]).then(([unitUniqueEquip, promotionData, storyStatusData]) => {
      const skill_enhance_status: SkillEnhanceStatus = {
        ub: max_level,
        1: max_level,
        2: max_level,
        ex: max_level,
      };
      const equip_enhance_status: EquipEnhanceStatus = {};
      for (let slot of promotionData.equip_slots) {
        if (slot) equip_enhance_status[slot.equipment_id] = slot.max_enhance_level;
      }
      const love_level_status: LoveLevelStatus = {};
      love_level_status[storyStatusData.self_story.chara_id] = storyStatusData.self_story.max_love_level;
      for (let shareStory of storyStatusData.share_stories) {
        love_level_status[shareStory.chara_id] = shareStory.max_love_level;
      }
      return {
        user_name,
        unit_id,
        level: max_level,
        rarity: 0,
        promotion_level: max_promotion_level,
        skill_enhance_status,
        equip_enhance_status,
        love_level_status,
        unique_equip_id: unitUniqueEquip ? unitUniqueEquip.equip_id : 999999,
        unique_enhance_level: unitUniqueEquip ? max_unique_enhance_level : 0,
      } as PCRStoreValue<'user_profile'>;
    }),

    tx.objectStore('unit_rarity').index('unit_rarity_0_unit_id').count(unit_id)
  ]);

  charaData.max_rarity = unitRarityCount // unitRarities.length;
  userProfile.rarity = unitRarityCount;

  return [charaData, userProfile];
}

export async function getAllInit(
  db: PCRDB,
  user_name: string,
  max_level: number,
  max_promotion_level: number,
  max_unique_enhance_level: number,
  memo?: StoryStatusMemo
): Promise<[PCRStoreValue<'chara_data'>[], PCRStoreValue<'user_profile'>[]]> {
  const allCharaData: PCRStoreValue<'chara_data'>[] = [];
  const userProfiles: PCRStoreValue<'user_profile'>[] = [];
  const promiseArr: Promise<void>[] = [];
  await db.transaction('unit_profile', 'readonly').store.getAllKeys().then(keys => {
    for (let unit_id of keys) {
      // if (excludeUnitID.indexOf(unit_id) < 0) {
      promiseArr.push(getInit(
        db,
        user_name,
        unit_id,
        max_level,
        max_promotion_level,
        max_unique_enhance_level,
        memo
      ).then(([charaData, userProfile]) => {
        allCharaData.push(charaData);
        userProfiles.push(userProfile);
      }));
      // }
    }
  });
  await Promise.all(promiseArr);
  return [allCharaData, userProfiles];
}
