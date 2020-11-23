export interface UserProfile {
  user_name: string;
  unit_id: number;
  level: number;
  rarity: number;
  promotion_level: number;
  unique_enhance_level: number;
  skill_enhance_status: Record</*skill*/'ub' | 1 | 2 | 'ex', /*enhance_level*/number>;
  equip_enhance_status: Record</*0-5*/number, /*enhance_level*/number>;
  love_level_status: Record</*chara_id*/number, /*love_level*/number>;
}

declare const data: UserProfile[];
export default data;
