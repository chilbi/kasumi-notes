import { Property } from './property';
import { PCRDB } from '../db';

export interface PromotionStatusData {
  unit_id: number;
  promotion_level: number;
  unit_promotion_status: Property;
  getProperty(): Property;
}

export function getPromotionStatusProperty(this: PromotionStatusData): Property {
  return this.unit_promotion_status;
}

export async function getPromotionStatusData(db: PCRDB, unit_id: number, promotion_level: number): Promise<PromotionStatusData> {
  const unitPromotionStatus = await db.transaction('unit_promotion_status', 'readonly').store.get([unit_id, promotion_level]);
  if (!unitPromotionStatus) throw new Error(`objectStore('unit_promotion_status').get(/*unit_id*/[${unit_id}, /*promotion_level*/${promotion_level}]) => undefined`);
  const data: PromotionStatusData = {
    unit_id,
    promotion_level,
    unit_promotion_status: unitPromotionStatus,
  } as any;
  data.getProperty = getPromotionStatusProperty.bind(data);
  return data;
}
