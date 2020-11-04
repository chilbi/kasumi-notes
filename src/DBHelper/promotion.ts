import { PCRDB } from '../db';
import { plus, Property } from './property';
import { getEquipData, EquipData } from './equip';
import Big from 'big.js';

export type EquipEnhanceStatus = Record</*0-5*/number, /*enhance_level*/number>;

export interface PromotionData {
  unit_id: number;
  promotion_level: number;
  equip_slots: (EquipData | undefined)[];
  getProperty(equipEnhanceStatus: EquipEnhanceStatus): Property<Big>;
}

function getProperty(this: PromotionData, equipEnhanceStatus: EquipEnhanceStatus): Property<Big> {
  return plus(this.equip_slots.map((equipData, i) => {
    if (equipData) {
      const enhance_level = equipEnhanceStatus[i];
      if (enhance_level !== undefined && enhance_level > -1) {
        return equipData.getProperty(enhance_level);
      }
    }
    return undefined;
  }));
}

export async function getPromotionData(db: PCRDB, unit_id: number, promotion_level: number): Promise<PromotionData> {
  const unitPromotion = await db.transaction('unit_promotion', 'readonly').store.get([unit_id, promotion_level]);
  if (!unitPromotion) throw new Error(`objectStore('unit_promotion').get(/*unit_id*/[${unit_id}, /*promotion_level*/${promotion_level}]) => undefined`);
  const equip_slots = await Promise.all(Array.from(Array(6)).map((_, i) => {
    const equip_id = unitPromotion['equip_slot_' + (i + 1) as keyof typeof unitPromotion];
    return equip_id === 999999 ? undefined : getEquipData(db, equip_id);
  }));
  return {
    unit_id,
    promotion_level,
    equip_slots,
    getProperty,
  };
}
