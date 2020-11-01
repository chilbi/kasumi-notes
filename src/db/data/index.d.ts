import { DBSchema } from 'idb';
import { PCRDB } from '..';
import { ActualUnitBackground } from './actual_unit_background';
import { CharaStoryStatus } from './chara_story_status';
import { EnemyRewardData } from './enemy_reward_data';
import { EquipmentData } from './equipment_data';
import { EquipmentEnhanceRate } from './equipment_enhance_rate';
import { QuestData } from './quest_data';
import { SkillAction } from './skill_action';
import { SkillData } from './skill_data';
import { UniqueEquipmentData } from './unique_equipment_data';
import { UniqueEquipmentEnhanceRate } from './unique_equipment_enhance_rate';
import { UnitAttackPattern } from './unit_attack_pattern';
import { UnitData } from './unit_data';
import { UnitProfile } from './unit_profile';
import { UnitPromotion } from './unit_promotion';
import { UnitPromotionStatus } from './unit_promotion_status';
import { UnitRarity } from './unit_rarity';
import { UnitSkillData } from './unit_skill_data';
import { UnitUniqueEquip } from './unit_unique_equip';
import { WaveGroupData } from './wave_group_data';
import { ImageData } from './image_data';
import { CharaData } from './chara_data';
import { UserProfile } from './user_profile';

export interface PCRDBSchema extends DBSchema {
  'actual_unit_background': {
    key: number;
    value: ActualUnitBackground;
  };
  'chara_story_status': {
    key: [number, number];
    value: CharaStoryStatus;
    indexes: {
      'chara_story_status_0_chara_id': number;
    };
  };
  'enemy_reward_data': {
    key: number;
    value: EnemyRewardData;
  };
  'equipment_data': {
    key: number;
    value: EquipmentData;
  };
  'equipment_enhance_rate': {
    key: number;
    value: EquipmentEnhanceRate;
  };
  'quest_data': {
    key: number;
    value: QuestData;
  };
  'skill_action': {
    key: number;
    value: SkillAction;
  };
  'skill_data': {
    key: number;
    value: SkillData;
  };
  'unique_equipment_data': {
    key: number;
    value: UniqueEquipmentData;
  };
  'unique_equipment_enhance_rate': {
    key: number;
    value: UniqueEquipmentEnhanceRate;
  };
  'unit_attack_pattern': {
    key: number;
    value: UnitAttackPattern;
    indexes: {
      'unit_attack_pattern_0_unit_id': number;
    };
  };
  'unit_data': {
    key: number;
    value: UnitData;
  };
  'unit_profile': {
    key: number;
    value: UnitProfile;
  };
  'unit_promotion': {
    key: [number, number];
    value: UnitPromotion;
    indexes: {
      'unit_promotion_0_unit_id': number;
    };
  };
  'unit_promotion_status': {
    key: [number, number];
    value: UnitPromotionStatus;
  };
  'unit_rarity': {
    key: [number, number];
    value: UnitRarity;
    indexes: {
      'unit_rarity_0_unit_id': number;
      'unit_rarity_0_unit_material_id': number;
    };
  };
  'unit_skill_data': {
    key: number;
    value: UnitSkillData;
  };
  'unit_unique_equip': {
    key: number;
    value: UnitUniqueEquip;
  };
  'wave_group_data': {
    key: number;
    value: WaveGroupData;
  };
  'image_data': {
    key: string;
    value: ImageData;
    indexes: {
      'image_data_0_last_visit': Date;
    };
  };
  'chara_data': {
    key: number;
    value: CharaData;
  };
  'user_profile': {
    key: [string, number];
    value: UserProfile;
    indexes: {
      'user_profile_0_user_name': string;
    };
  };
}

export async function insert(db: PCRDB, onProgress?: (count: number, total: number) => void): Promise<void>;
