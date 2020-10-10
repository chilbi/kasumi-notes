import { PCRDB, PCRStoreValue } from '../db';
import { plusMultiply, Property } from './property';

export interface UniqueEquipData {
  unit_id: number;
  unique_equipment_data: PCRStoreValue<'unique_equipment_data'>;
  unique_equipment_enhance_rate: PCRStoreValue<'unique_equipment_enhance_rate'>;
  getProperty(enhance_level: number): Property;
}

export function getUniqueEquipProperty(this: UniqueEquipData, enhance_level: number): Property {
  return plusMultiply(this.unique_equipment_data, this.unique_equipment_enhance_rate, enhance_level, v => v, v => Math.ceil(v));
}

export async function getUniqueEquipData(db: PCRDB, unit_id: number): Promise<UniqueEquipData | undefined>
export async function getUniqueEquipData(db: PCRDB, unit_id: number, unique_equip_id: number): Promise<UniqueEquipData>;
export async function getUniqueEquipData(db: PCRDB, unit_id: number, unique_equip_id?: number): Promise<UniqueEquipData | undefined> {
  if (!unique_equip_id) {
    const unitUniqueEquip = await db.transaction('unit_unique_equip', 'readonly').store.get(unit_id);
    if (!unitUniqueEquip) return undefined;
    unique_equip_id = unitUniqueEquip.equip_id;
  }
  const tx = db.transaction(['unique_equipment_data', 'unique_equipment_enhance_rate'], 'readonly');
  const [uniqueEquipmentData, uniqueEquipmentEnhanceRate] = await Promise.all([
    tx.objectStore('unique_equipment_data').get(unique_equip_id),
    tx.objectStore('unique_equipment_enhance_rate').get(unique_equip_id)
  ]);
  if (!uniqueEquipmentData) throw new Error(`objectStore('unique_equipment_data').get(/*unique_equip_id*/${unique_equip_id}) => undefined`);
  if (!uniqueEquipmentEnhanceRate) throw new Error(`objectStore('unique_equipment_enhance_rate').get(/*unique_equip_id*/${unique_equip_id}) => undefined`);
  const data: UniqueEquipData = {
    unit_id,
    unique_equipment_data: uniqueEquipmentData,
    unique_equipment_enhance_rate: uniqueEquipmentEnhanceRate,
  } as any;
  data.getProperty = getUniqueEquipProperty.bind(data);
  return data;
}
