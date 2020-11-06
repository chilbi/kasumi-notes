import { CraftData } from './equip_craft';

export function getUniqueCraft(equipment_id: number): [number/*unique_enhance_level*/, CraftData[]][] {
  const memory_id = parseInt('31' + equipment_id.toString().substr(2, 3));
  const _getCraft = (lv: number, heart_num: number, memory_num: number, heart_id = 140001): [number, CraftData[]] =>
    [lv, [{ material_id: heart_id, consume_num: heart_num }, { material_id: memory_id, consume_num: memory_num }]];
  return [
    _getCraft(30, 3, 50, 140000),
    _getCraft(50, 5, 10),
    _getCraft(70, 5, 10),
    _getCraft(90, 8, 10),
    _getCraft(110, 10, 10),
    _getCraft(130, 10, 10),
    _getCraft(140, 10, 15),
    _getCraft(150, 10, 15),
    _getCraft(160, 10, 15),
    _getCraft(170, 10, 15),
    _getCraft(180, 10, 15),
  ];
}
