export interface WaveGroupData {
  wave_group_id: number;
  enemy_id_1: number;
  drop_gold_1: number;
  drop_reward_id_1: number;
  enemy_id_2: number;
  drop_gold_2: number;
  drop_reward_id_2: number;
  enemy_id_3: number;
  drop_gold_3: number;
  drop_reward_id_3: number;
  enemy_id_4: number;
  drop_gold_4: number;
  drop_reward_id_4: number;
  enemy_id_5: number;
  drop_gold_5: number;
  drop_reward_id_5: number;
  guest_enemy_id: number;
}

declare const data: WaveGroupData[];
export default data;
