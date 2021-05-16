export interface SkillData {
  skill_id: number;
  name: string;
  skill_cast_time: number;
  boss_ub_cool_time: number;
  action_1: number;
  action_2: number;
  action_3: number;
  action_4: number;
  action_5: number;
  action_6: number;
  action_7: number;
  description: string;
  icon_type: number;
}

declare const data: SkillData[];
export default data;
