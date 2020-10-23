import { PCRDB } from '../db';
import { plusMultiply, Property } from './property';

export interface RarityData {
  unit_id: number;
  rarity: number;
  unit_rarity: Property;
  getProperty(level: number, promotion_level: number): Property;
}

export function getRarityProperty(this: RarityData, level: number, promotion_level: number): Property {
  return plusMultiply(this.unit_rarity, this.unit_rarity, level + promotion_level, v => v.round(), v => v, '_growth');
}

export async function getRarityData(db: PCRDB, unit_id: number, rarity: number): Promise<RarityData> {
  const unitRarity = await db.transaction('unit_rarity', 'readonly').store.get([unit_id, rarity]);
  if (!unitRarity) throw new Error(`objectStore('unit_rarity').get(/*unit_id*/[${unit_id}, /*rarity*/${rarity}]) => undefined`);
  const data: RarityData = {
    unit_id,
    rarity,
    unit_rarity: unitRarity,
  } as any;
  data.getProperty = getRarityProperty.bind(data);
  return data;
}
