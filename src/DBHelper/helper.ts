import { Property } from './property';
import { PCRStoreValue } from '../db';
import Big from 'big.js';

export interface OtherProperty {
  skill_lv: number; // 10
  exskill_evolution: number; // 15
  overall: number; // 1
  skill1_evolution: number; // 10
  skill1_evolution_slv: number; // 1
  ub_evolution: number; // 200
  ub_evolution_slv: number; // 1.5
}

// TODO 计算公式错误
export function getOtherProperty(userProfile: PCRStoreValue<'user_profile'>): OtherProperty {
  const skillStatus = userProfile.skill_enhance_status;
  const hasUnique = userProfile.unique_enhance_level > 0;
  const hasExEvo = userProfile.rarity > 4;
  const hasUBEvo = userProfile.rarity > 5;
  let skillLv = skillStatus['ub'] + skillStatus[1] + skillStatus[2];
  if (!hasExEvo) skillLv += skillStatus['ex'];
  return {
    skill_lv: skillLv,
    exskill_evolution: hasExEvo ? skillStatus['ex'] : 0,
    overall: 0,
    skill1_evolution: hasUnique ? skillStatus[1] : 0,
    skill1_evolution_slv: hasUnique ? skillStatus[1] : 0,
    ub_evolution: hasUBEvo ? 1 : 0,
    ub_evolution_slv: hasUBEvo ? skillStatus['ub'] : 0,
  };
}

export function getFightingCapacity(property: Property<Big>, other: OtherProperty): Big {
  return [
    [property.hp, 0.1],
    [property.atk, 1],
    [property.magic_str, 1],
    [property.def, 4.5],
    [property.magic_def, 4.5],
    [property.physical_critical, 0.5],
    [property.magic_critical, 0.5],
    [property.wave_hp_recovery, 0.1],
    [property.wave_energy_recovery, 0.3],
    [property.dodge, 6],
    [property.physical_penetrate, 6],
    [property.magic_penetrate, 6],
    [property.life_steal, 4.5],
    [property.hp_recovery_rate, 1],
    [property.energy_recovery_rate, 1.5],
    [property.energy_reduce_rate, 3.0],
    [property.accuracy, 2],
    [other.skill_lv, 10],
    [other.exskill_evolution, 15],
    [other.overall, 1],
    [other.skill1_evolution, 10],
    [other.skill1_evolution_slv, 1.2],
    [other.ub_evolution, 200],
    [other.ub_evolution_slv, 1.5],
  ].reduce((calc, item) => calc.plus(Big(item[0]).times(item[1])), Big(0));
}

export function getPositionText(position: number): string {
  if (position === 1) return '前衛';
  else if (position === 2) return '中衛';
  else return '後衛';
}

export function getRankPoint(p: number) {
  if (p >= 18) {
    return 18;
  } else if (p >= 11) {
    return 11;
  } else if (p >= 7) {
    return 7;
  } else if (p >= 4) {
    return 4;
  } else if(p >= 2) {
    return 2;
  } else {
    return 1;
  }
}

export function getSubID(unitID: number | string): string {
  return unitID.toString().substr(0, 4);
}

export function getCharaID(unitID: number | string) {
  return parseInt(getSubID(unitID));
}

export function getParamsUnitID(unitID: string): number {
  const len = unitID.length;
  if (len <= 4) unitID = '100'.substr(0, 4 - len) + unitID + '01';
  if (len !== 6) unitID = unitID.substr(0, 4) + '01';
  return parseInt(unitID);
}

export function getValidID(unitID: number | string, rarity = 3, min = 1, last = 1): string {
  rarity = rarity < 3 ? min : rarity > 3 && rarity < 6 ? 3 : rarity;
  return getSubID(unitID) + rarity + last;
}

type ImagePathType =
  | 'plate' | 'unit' | 'unit_shadow' | 'equipment' | 'item' | 'skill'
  | 'full' | 'profile' | 'actual_profile' | 'story';

export function getImageUrl(type: ImagePathType, name: string) {
  let path = '';
  switch (type) {
    case 'plate':
    case 'unit':
    case 'unit_shadow':
    case 'equipment':
    case 'item':
    case 'skill':
      path = `icon/${type}/${name}.webp`;
      break;
    case 'full':
    case 'profile':
    case 'actual_profile':
    case 'story':
      path = `/card/${type}/${name}.webp`;
      break;
  }
  return 'https://redive.estertion.win/' + path;
}

type PublicImagePathType = 'icon_equipment' | 'icon_skill' | 'icon_state' | 'icon_unit' | 'still_unit' | 'thumb_story' | 'unit_plate' | 'icon_map' | 'icon_item';

export function getPublicImageURL(type: PublicImagePathType, name: string | number): string {
  return `${process.env.PUBLIC_URL}/images/${type}/${type}_${name}.png`;
}

export function getRewardRarity(rewardID: number): string  {
  const str = rewardID.toString();
  return str[str.length - 4];
}

export type Range = [number, number];

export type QuestType = 'N'/*Normal*/ | 'H'/*Hard*/ | 'VH'/*Very Hard*/ | 'S'/*Survey*/;

const mapRange: Record<string, Range | undefined> = {
  'N1': [11001001, 11004013],
  'N2': [11001008, 11008015],
  'N3': [11004003, 11013017],
  'N4': [11006013, 11024014],
  'N5': [11016004, 12000000],
  'N6': [11037004, 12000000],
  'H1': [12001001, 13000000],
  'H2': [12001001, 12008003],
  'H3': [12003001, 12013003],
  'H4': [12007001, 12024003],
  'H5': [12016001, 13000000],
  'H6': [12037001, 13000000],
};

export function mergeRanges(ranges: Range[], a = 0, b = 1, length = ranges.length): Range[] {
  if (a + 1 === length) return ranges;
  const
    [a0, a1] = ranges[a],
    [b0, b1] = ranges[b];
  if (a1 < b0 || b1 < a0) {
    if (b + 1 === length)
      return mergeRanges(ranges, a + 1, a + 2, length);
    else
      return mergeRanges(ranges, a, b + 1, length);
  } else {
    ranges[b] = [Math.min(a0, a1, b0, b1), Math.max(a0, a1, b0, b1)];
    ranges.splice(a, 1);
    return mergeRanges(ranges, 0, 1, length - 1);
  }
}

export function getRange(type: QuestType, rewardID: number): Range | undefined {
  if (type === 'VH' || type === 'S')
    return mapQuestType(type);
  if (rewardID > 33000) {
    if (rewardID === 140001) {
      return mapQuestType('S');
    } else {
      const rewardRarity = getRewardRarity(rewardID);
      return mapRange[type + rewardRarity];
    }
  } else if (rewardID > 32000) {
    return mapQuestType('VH');
  } else if (rewardID > 31000) {
    return mapQuestType('H');
  } else if (rewardID === 25001) {
    return mapQuestType('S');
  }
}

export function mapQuestType(questID: number): QuestType;
export function mapQuestType(type: QuestType): Range;
export function mapQuestType(arg: number | QuestType): QuestType | Range {
  if (typeof arg === 'number') {
    if (arg > 18000000) return 'S';
    else if (arg > 13000000) return 'VH';
    else if (arg > 12000000) return 'H';
    else return 'N';
  } else {
    switch (arg) {
      case 'N':
        return [11001001, 12000000];
      case 'H':
        return [12001001, 13000000];
      case 'VH':
        return [13001001, 14000000];
      case 'S':
        return [18001001, 20000000];
    }
  }
}

export function deepClone<T>(target: T): T {
  let result: any;
  if (typeof target === 'object') {
    if (Array.isArray(target)) {
      result = [];
      for (let i in target) {
        result[i] = deepClone(target[i]);
      }
      return result;
    } else if (target === null) {
      result = null;
    } else {
      result = {};
      for (let i in target) {
        result[i] = deepClone(target[i]);
      }
    }
  } else {
    result = target;
  }
  return result;
}

export function equal<T>(a: T, b: T): boolean {
  if (typeof a === 'object') {
    for (let i in a) {
      if (!equal(a[i], b[i])) return false;
    }
    return true;
  } else {
    return a === b;
  }
}
