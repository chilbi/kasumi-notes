export interface UnitData {
  unit_id: number;
  unit_name: string;
  kana: string;
  prefab_id: number;
  is_limited: number;
  rarity: number;
  motion_type: number;
  se_type: number;
  move_speed: number;
  search_area_width: number;
  atk_type: number;
  normal_atk_cast_time: number;
  cutin_1: number;
  cutin_2: number;
  cutin1_star6: number;
  cutin2_star6: number;
  guild_id: number;
  exskill_display: number;
  comment: string;
  only_disp_owned: number;
  start_time: string;
  end_time: string;
}

declare const data: UnitData[];
export default data;
