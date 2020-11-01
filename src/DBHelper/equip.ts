import { PCRDB, PCRStoreValue } from '../db';
import { plusMultiply, Property } from './property';
import Big from 'big.js';

export interface EquipData {
  equipment_id: number;
  equipment_name: string;
  description: string;
  promotion_level: number;
  max_enhance_level: number;
  equipment_data: PCRStoreValue<'equipment_data'>;
  equipment_enhance_rate: PCRStoreValue<'equipment_enhance_rate'>;
  getProperty(enhance_level: number): Property<Big>;
}

function getProperty(this: EquipData, enhance_level: number): Property<Big> {
  return plusMultiply(this.equipment_data, this.equipment_enhance_rate, enhance_level, v => v.round(0, 3));
}

export async function getEquipData(db: PCRDB, equipment_id: number): Promise<EquipData> {
  const tx = db.transaction(['equipment_data', 'equipment_enhance_rate'], 'readonly');
  const [equipmentData, equipmentEnhanceRate] = await Promise.all([
    tx.objectStore('equipment_data').get(equipment_id),
    tx.objectStore('equipment_enhance_rate').get(equipment_id)
  ]);
  if (!equipmentData) throw new Error(`objectStore('equipment_data').get(/*equipment_id*/${equipment_id}) => undefined`);
  if (!equipmentEnhanceRate) throw new Error(`objectStore('equipment_enhance_rate').get(/*equipment_id*/${equipment_id}) => undefined`);
  return {
    equipment_id,
    equipment_name: equipmentData.equipment_name,
    description: equipmentData.description,
    promotion_level: equipmentData.promotion_level,
    max_enhance_level: equipmentData.promotion_level < 3 ? equipmentData.promotion_level - 1 : equipmentData.promotion_level > 3 ? 5 : 3,
    equipment_data: equipmentData,
    equipment_enhance_rate: equipmentEnhanceRate,
    getProperty,
  };
}
