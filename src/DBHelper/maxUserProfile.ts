import { PCRStoreValue } from '../db';

const maxUserProfile: PCRStoreValue<'user_profile'> = {
  user_name: 'MAX',
  unit_id: undefined as any,
  level: 178,
  rarity: 5,
  promotion_level: 18,
  unique_equip_id: 999999,
  unique_enhance_level: 180,
  skill_enhance_status: { ub: 178, 1: 178, 2: 178, ex: 178 },
  equip_enhance_status: {},
  love_level_status: {},
};

export default maxUserProfile;
