import { CraftData } from './equip_craft';
import maxUserProfile from './maxUserProfile';

export type UniqueCraft = [number/*unique_enhance_level*/, CraftData[]];

export function getUniqueCraft(equipment_id: number): UniqueCraft[] {
  const memory_id = parseInt('31' + equipment_id.toString().substr(2, 3));
  const getCraft = (lv: number, heart_num: number, memory_num: number, heart_id = 140001): [number, CraftData[]] =>
    [lv, [{ material_id: heart_id, consume_num: heart_num }, { material_id: memory_id, consume_num: memory_num }]];
  const items: UniqueCraft[] = [];
  const maxEnhanceLevel = maxUserProfile.unique_enhance_level;
  let enhanceLevel = 140;
  while (enhanceLevel <= maxEnhanceLevel) {
    items.push(getCraft(enhanceLevel, 10, 15));
    enhanceLevel += 10;
  }
  return [
    getCraft(30, 3, 50, 140000),
    getCraft(50, 5, 10),
    getCraft(70, 5, 10),
    getCraft(90, 8, 10),
    getCraft(110, 10, 10),
    getCraft(130, 10, 10),
    ...items
  ];
}
