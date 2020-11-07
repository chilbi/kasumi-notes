import { PCRDB, PCRStoreValue } from '../db';
import { Property } from './property';
// import Big from 'big.js';

export interface PromotionStatusData {
  unit_id: number;
  promotion_level: number;
  unit_promotion_status: PCRStoreValue<'unit_promotion_status'>;
  getProperty(): Property<number>;
}

function getProperty(this: PromotionStatusData): Property<number> {
  return this.unit_promotion_status;
}

export async function getPromotionStatusData(db: PCRDB, unit_id: number, promotion_level: number): Promise<PromotionStatusData> {
  let unit_promotion_status = {} as PCRStoreValue<'unit_promotion_status'>;
  if (promotion_level > 1) {
    const unitPromotionStatus = await db.transaction('unit_promotion_status', 'readonly').store.get([unit_id, promotion_level]);
    if (!unitPromotionStatus) throw new Error(`objectStore('unit_promotion_status').get(/*unit_id*/[${unit_id}, /*promotion_level*/${promotion_level}]) => undefined`);
    unit_promotion_status = unitPromotionStatus;
  }
  return {
    unit_id,
    promotion_level,
    unit_promotion_status,
    getProperty,
  };
}
