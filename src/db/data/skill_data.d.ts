export interface SkillData {
  skill_id: number;
  name: string;
  skill_type: number;
  skill_area_width: number;
  skill_cast_time: number;
  action_1: number;
  action_2: number;
  action_3: number;
  action_4: number;
  action_5: number;
  action_6: number;
  action_7: number;
  depend_action_1: number;
  depend_action_2: number;
  depend_action_3: number;
  depend_action_4: number;
  depend_action_5: number;
  depend_action_6: number;
  depend_action_7: number;
  description: string;
  icon_type: number;
}

declare const data: SkillData[];
export default data;
