import { PCRDB } from '../db';

export interface CraftData {
  material_id: number;
  consume_num: number;
}

export interface EquipCraft {
  equipment_id: number;
  craft_data: CraftData[]; // 1-10
}

function getCraftData(arr: (CraftData | EquipCraft)[]): CraftData[] {
  const result: CraftData[] = [];
  const isEquipCraft = (obj: any): obj is EquipCraft => obj.material_id === undefined;
  for (let item of arr) {
    if (isEquipCraft(item))
      result.push(...item.craft_data);
    else
      result.push(item);
  }
  return result;
}

export async function getEquipCraft(db: PCRDB, equipment_id: number): Promise<EquipCraft> {
  const equipmentCraft = await db.transaction('equipment_craft', 'readonly').store.get(equipment_id);
  if (!equipmentCraft) throw new Error(`objectStore('equipment_craft').get(/*equipment_id*/${equipment_id}) => undefined`);
  const promiseArr: Promise<CraftData | EquipCraft>[] = [];
  let i = 1;
  while (i <= 10) {
    const condition_equipment_id = equipmentCraft['condition_equipment_id_' + i as keyof typeof equipmentCraft];
    if (condition_equipment_id === 0) break;
    const consume_num = equipmentCraft['consume_num_' + i as keyof typeof equipmentCraft];
    promiseArr.push(db.transaction('equipment_data', 'readonly').store.get(condition_equipment_id).then<CraftData | EquipCraft>(equipmentData => {
      if (!equipmentData) throw new Error(`objectStore('equipment_data').get(/*equipment_id*/${condition_equipment_id}) => undefined`);
      if (equipmentData.craft_flg === 1)
        return getEquipCraft(db, condition_equipment_id);
      else
        return {
          material_id: condition_equipment_id,
          consume_num,
        };
    }));
    i++;
  }
  const arr = await Promise.all(promiseArr);
  const craft_data = getCraftData(arr);
  return {
    equipment_id,
    craft_data,
  };
}
