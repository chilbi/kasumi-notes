import { PCRDB, PCRStoreValue } from '../db';
import { plusMultiply, Property } from './property';
import Big from 'big.js';

export interface RarityData {
  unit_id: number;
  rarity: number;
  unit_rarity: PCRStoreValue<'unit_rarity'>;
  getProperty(level: number, promotion_level: number): Property<Big>;
}

function getProperty(this: RarityData, level: number, promotion_level: number): Property<Big> {
  return plusMultiply(this.unit_rarity, this.unit_rarity, level + promotion_level/*, v => v.round(0, 1)*/, v => v, v => v, '_growth');
}

export async function getRarityData(db: PCRDB, unit_id: number, rarity: number): Promise<RarityData> {
  const unitRarity = await db.transaction('unit_rarity', 'readonly').store.get([unit_id, rarity]);
  if (!unitRarity) throw new Error(`objectStore('unit_rarity').get([/*unit_id*/${unit_id}, /*rarity*/${rarity}]) => undefined`);
  return {
    unit_id,
    rarity,
    unit_rarity: unitRarity,
    getProperty,
  };
}
