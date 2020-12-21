export interface QuestData {
  quest_id: number;
  area_id: number;
  quest_name: string;
  wave_group_id_1: number;
  wave_group_id_2: number;
  wave_group_id_3: number;
  reward_image_1: number;
  reward_image_2: number;
  reward_image_3: number;
  reward_image_4: number;
  reward_image_5: number;
}

declare const data: QuestData[];
export default data;
