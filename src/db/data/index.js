// @ts-check
import actualUnitBackground from './actual_unit_background';
import charaStoryStatus from './chara_story_status';
import enemyRewardData from './enemy_reward_data';
import equipmentData from './equipment_data';
import equipmentEnhanceRate from './equipment_enhance_rate';
import questData from './quest_data';
import skillAction from './skill_action';
import skillData from './skill_data';
import uniqueEquipmentData from './unique_equipment_data';
import uniqueEquipmentEnhanceRate from './unique_equipment_enhance_rate';
import unitAttackPattern from './unit_attack_pattern';
import unitData from './unit_data';
import unitProfile from './unit_profile';
import unitPromotion from './unit_promotion';
import unitPromotionStatus from './unit_promotion_status';
import unitRarity from './unit_rarity';
import unitSkillData from './unit_skill_data';
import unitUniqueEquip from './unit_unique_equip';
import waveGroupData from './wave_group_data';

/**
 * @param {import('..').PCRDB} db 
 * @param {(count: number, total: number) => void} [onProgress] 
 * @returns {Promise<void>}
 */
export async function insert(db, onProgress = () => null) {
  /** @type Promise<any>[] */
  let insertTasks;

  insertTasks = [];
  const actualUnitBackgroundTransaction = db.transaction('actual_unit_background', 'readwrite');
  actualUnitBackground.forEach(record => insertTasks.push(actualUnitBackgroundTransaction.store.add(record)));
  insertTasks.push(actualUnitBackgroundTransaction.done);
  await Promise.all(insertTasks);
  onProgress(124, 23952);

  insertTasks = [];
  const charaStoryStatusTransaction = db.transaction('chara_story_status', 'readwrite');
  charaStoryStatus.forEach(record => insertTasks.push(charaStoryStatusTransaction.store.add(record)));
  insertTasks.push(charaStoryStatusTransaction.done);
  await Promise.all(insertTasks);
  onProgress(844, 23952);

  insertTasks = [];
  const enemyRewardDataTransaction = db.transaction('enemy_reward_data', 'readwrite');
  enemyRewardData.forEach(record => insertTasks.push(enemyRewardDataTransaction.store.add(record)));
  insertTasks.push(enemyRewardDataTransaction.done);
  await Promise.all(insertTasks);
  onProgress(2667, 23952);

  insertTasks = [];
  const equipmentDataTransaction = db.transaction('equipment_data', 'readwrite');
  equipmentData.forEach(record => insertTasks.push(equipmentDataTransaction.store.add(record)));
  insertTasks.push(equipmentDataTransaction.done);
  await Promise.all(insertTasks);
  onProgress(593, 23952);

  insertTasks = [];
  const equipmentEnhanceRateTransaction = db.transaction('equipment_enhance_rate', 'readwrite');
  equipmentEnhanceRate.forEach(record => insertTasks.push(equipmentEnhanceRateTransaction.store.add(record)));
  insertTasks.push(equipmentEnhanceRateTransaction.done);
  await Promise.all(insertTasks);
  onProgress(315, 23952);

  insertTasks = [];
  const questDataTransaction = db.transaction('quest_data', 'readwrite');
  questData.forEach(record => insertTasks.push(questDataTransaction.store.add(record)));
  insertTasks.push(questDataTransaction.done);
  await Promise.all(insertTasks);
  onProgress(693, 23952);

  insertTasks = [];
  const skillActionTransaction = db.transaction('skill_action', 'readwrite');
  skillAction.forEach(record => insertTasks.push(skillActionTransaction.store.add(record)));
  insertTasks.push(skillActionTransaction.done);
  await Promise.all(insertTasks);
  onProgress(4860, 23952);

  insertTasks = [];
  const skillDataTransaction = db.transaction('skill_data', 'readwrite');
  skillData.forEach(record => insertTasks.push(skillDataTransaction.store.add(record)));
  insertTasks.push(skillDataTransaction.done);
  await Promise.all(insertTasks);
  onProgress(2118, 23952);

  insertTasks = [];
  const uniqueEquipmentDataTransaction = db.transaction('unique_equipment_data', 'readwrite');
  uniqueEquipmentData.forEach(record => insertTasks.push(uniqueEquipmentDataTransaction.store.add(record)));
  insertTasks.push(uniqueEquipmentDataTransaction.done);
  await Promise.all(insertTasks);
  onProgress(93, 23952);

  insertTasks = [];
  const uniqueEquipmentEnhanceRateTransaction = db.transaction('unique_equipment_enhance_rate', 'readwrite');
  uniqueEquipmentEnhanceRate.forEach(record => insertTasks.push(uniqueEquipmentEnhanceRateTransaction.store.add(record)));
  insertTasks.push(uniqueEquipmentEnhanceRateTransaction.done);
  await Promise.all(insertTasks);
  onProgress(93, 23952);

  insertTasks = [];
  const unitAttackPatternTransaction = db.transaction('unit_attack_pattern', 'readwrite');
  unitAttackPattern.forEach(record => insertTasks.push(unitAttackPatternTransaction.store.add(record)));
  insertTasks.push(unitAttackPatternTransaction.done);
  await Promise.all(insertTasks);
  onProgress(1105, 23952);

  insertTasks = [];
  const unitDataTransaction = db.transaction('unit_data', 'readwrite');
  unitData.forEach(record => insertTasks.push(unitDataTransaction.store.add(record)));
  insertTasks.push(unitDataTransaction.done);
  await Promise.all(insertTasks);
  onProgress(169, 23952);

  insertTasks = [];
  const unitProfileTransaction = db.transaction('unit_profile', 'readwrite');
  unitProfile.forEach(record => insertTasks.push(unitProfileTransaction.store.add(record)));
  insertTasks.push(unitProfileTransaction.done);
  await Promise.all(insertTasks);
  onProgress(130, 23952);

  insertTasks = [];
  const unitPromotionTransaction = db.transaction('unit_promotion', 'readwrite');
  unitPromotion.forEach(record => insertTasks.push(unitPromotionTransaction.store.add(record)));
  insertTasks.push(unitPromotionTransaction.done);
  await Promise.all(insertTasks);
  onProgress(2774, 23952);

  insertTasks = [];
  const unitPromotionStatusTransaction = db.transaction('unit_promotion_status', 'readwrite');
  unitPromotionStatus.forEach(record => insertTasks.push(unitPromotionStatusTransaction.store.add(record)));
  insertTasks.push(unitPromotionStatusTransaction.done);
  await Promise.all(insertTasks);
  onProgress(2346, 23952);

  insertTasks = [];
  const unitRarityTransaction = db.transaction('unit_rarity', 'readwrite');
  unitRarity.forEach(record => insertTasks.push(unitRarityTransaction.store.add(record)));
  insertTasks.push(unitRarityTransaction.done);
  await Promise.all(insertTasks);
  onProgress(769, 23952);

  insertTasks = [];
  const unitSkillDataTransaction = db.transaction('unit_skill_data', 'readwrite');
  unitSkillData.forEach(record => insertTasks.push(unitSkillDataTransaction.store.add(record)));
  insertTasks.push(unitSkillDataTransaction.done);
  await Promise.all(insertTasks);
  onProgress(907, 23952);

  insertTasks = [];
  const unitUniqueEquipTransaction = db.transaction('unit_unique_equip', 'readwrite');
  unitUniqueEquip.forEach(record => insertTasks.push(unitUniqueEquipTransaction.store.add(record)));
  insertTasks.push(unitUniqueEquipTransaction.done);
  await Promise.all(insertTasks);
  onProgress(93, 23952);

  insertTasks = [];
  const waveGroupDataTransaction = db.transaction('wave_group_data', 'readwrite');
  waveGroupData.forEach(record => insertTasks.push(waveGroupDataTransaction.store.add(record)));
  insertTasks.push(waveGroupDataTransaction.done);
  await Promise.all(insertTasks);
  onProgress(3259, 23952);

}
