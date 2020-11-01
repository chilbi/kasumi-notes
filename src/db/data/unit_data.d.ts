export interface UnitData {
  unit_id: number;
  unit_name: string;
  kana: string;
  rarity: number;
  move_speed: number;
  search_area_width: number;
  atk_type: number;
  normal_atk_cast_time: number;
  comment: string;
}

declare const data: UnitData[];
export default data;
