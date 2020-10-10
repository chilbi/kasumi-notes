export interface CharaData {
  unit_id: number;
  unit_name: string;
  kana: string;
  actual_name: string;
  min_rarity: number;
  max_rarity: number;
  search_area_width: number;
  position: number;
  atk_type: number;
  normal_atk_cast_time: number;
  comment: string;
}

declare const data: CharaData[];
export default data;
