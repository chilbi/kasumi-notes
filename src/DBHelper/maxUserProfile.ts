import { PCRStoreValue } from '../db';

export const nullID = 999999;

export const maxArea = 41;

export const maxChara = 137;

export const equipGenre: [string, string][] = [
  ['01', '剣'],
  ['04', '刀'],
  ['07', '短剣'],
  ['10', 'ナックル'],
  ['13', '弓'],
  ['16', '槍'],
  ['19', '斧'],
  ['22', '攻撃杖'],
  ['25', '回復杖'],
  ['28', '軽装鎧'],
  ['31', '重装鎧'],
  ['34', '服'],
  ['37', '魔法服'],
  ['40', '盾'],
  ['43', '靴'],
  ['46', '魔法靴'],
  ['49', '兜'],
  ['52', '魔法帽子'],
  ['55', '攻撃アクセサリ'],
  ['58', '防御アクセサリ'],
  ['61', '魔法アクセサリ']
];

const maxUserProfile: PCRStoreValue<'user_profile'> = {
  user_name: 'MAX',
  unit_id: undefined as any,
  level: 184,
  rarity: 5,
  promotion_level: 19,
  unique_enhance_level: 190,
  skill_enhance_status: { ub: 184, 1: 184, 2: 184, ex: 184 },
  equip_enhance_status: {},
  love_level_status: {},
};

export default maxUserProfile;
