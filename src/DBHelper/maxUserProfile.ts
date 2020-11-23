import { PCRStoreValue } from '../db';

export const nullID = 999999;

export const maxArea = 40;

export const maxChara = 132;

const maxUserProfile: PCRStoreValue<'user_profile'> = {
  user_name: 'MAX',
  unit_id: undefined as any,
  level: 181,
  rarity: 5,
  promotion_level: 19,
  unique_enhance_level: 190,
  skill_enhance_status: { ub: 181, 1: 181, 2: 181, ex: 181 },
  equip_enhance_status: {},
  love_level_status: {},
};

export default maxUserProfile;
