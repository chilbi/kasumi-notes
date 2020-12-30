import { Property } from './property';
import { PCRStoreValue } from '../db';
import Big from 'big.js';

export interface OtherProperty {
  skill_lv: number;
  exskill_evolution: number;
  overall: number;
  skill1_evolution: number;
  skill1_evolution_slv: number;
  ub_evolution: number;
  ub_evolution_slv: number;
}

// TODO 计算公式错误, overall: ???, slv: ???
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

export function getRankPoint(r: number): number {
  return r > 17 ? 6
    : r > 10 ? 5
      : r > 6 ? 4
        : r > 3 ? 3
          : r > 1 ? 2
            : 1;
}

export function getSubID(unitID: number | string): string {
  return unitID.toString().substr(0, 4);
}

export function getCharaID(unitID: number | string): number {
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

export function getEquipRarity(idStr: string): string {
  return idStr.substr(2, 1) + idStr.substr(-1);
}

export function getEquipGenreID(idStr: string): string {
  return idStr.substr(3, 2);
}

export type Range = [number, number];

export type QuestType = 'N'/*Normal*/ | 'H'/*Hard*/ | 'VH'/*Very Hard*/ | 'S'/*Survey*/;

const mapRange: Record<string, Range | undefined> = {
  'N11': [11001001, 11004013], 'N21': [11001008, 11008015], 'N22': [11002003, 11008015], 'N23': [11002011, 11008014], 'N24': [11003006, 11008015], 'N31': [11004003, 11011017], 'N32': [11004012, 11011016], 'N33': [11006003, 11013017], 'N34': [11006011, 11013016], 'N41': [11006013, 11017014], 'N42': [11009004, 11021014], 'N43': [11011004, 11024014], 'N44': [11013004, 11024014], 'N51': [11016004, 11030013], 'N52': [11019004, 11036013], 'N53': [11022004, 11041014], 'N54': [11025004, 11041012], 'N55': [11028004, 11036014], 'N56': [11031004, 11039014], 'N57': [11034004, 11041014], 'N61': [11037004, 11041011], 'N62': [11040004, 11041014],
  'H11': [12001001, 12003001], 'H21': [12001003, 12008003], 'H22': [12002003, 12008003], 'H23': [12002003, 12008002], 'H24': [12006001, 12008003], 'H31': [12003003, 12012003], 'H32': [12004002, 12012003], 'H33': [12006002, 12013002], 'H34': [12008002, 12013003], 'H41': [12007002, 12021003], 'H42': [12009001, 12021003], 'H43': [12011001, 12024003], 'H44': [12013001, 12024003], 'H51': [12016001, 12030001], 'H52': [12019001, 12036001], 'H53': [12022001, 12041002], 'H54': [12025001, 12039001], 'H55': [12028001, 12036003], 'H56': [12031001, 12039003], 'H57': [12034001, 12041003], 'H61': [12037001, 12041003], 'H62': [12040001, 12041003],
  'VH41': [13018001, 13024003], 'VH42': [13018001, 13024003], 'VH52': [13020002, 13021003], 'VH53': [13018001, 13023003], 'VH54': [13018001, 13023002], 'VH55': [13019002, 13021002], 'VH56': [13020002, 13022003], 'VH57': [13022002, 13024001], 'VH61': [13023002, 13024003], 'VH62': [13024003, 13024003]
};

export function mergeRanges(ranges: Range[]): Range[] {
  const _mergeRanges = (_ranges: Range[], i: number, j: number, len: number): Range[] => {
    if (i + 1 === len) return _ranges;
    const
      [i0, i1] = _ranges[i],
      [j0, j1] = _ranges[j];
    if (i1 < j0 || j1 < i0) {
      if (j + 1 === len)
        return _mergeRanges(_ranges, i + 1, i + 2, len);
      else
        return _mergeRanges(_ranges, i, j + 1, len);
    } else {
      _ranges[j] = [Math.min(i0, i1, j0, j1), Math.max(i0, i1, j0, j1)];
      _ranges.splice(i, 1);
      return _mergeRanges(_ranges, 0, 1, len - 1);
    }
  };
  return _mergeRanges(ranges, 0, 1, ranges.length);
}

export function getRange(type: QuestType, rewardID: number): Range | undefined {
  if (type === 'S')
    return mapQuestType('S');
  if (rewardID > 33000) {
    if (rewardID === 140001) {
      return mapQuestType('S');
    } else {
      const rarity = getEquipRarity(rewardID.toString());
      return mapRange[type + rarity];
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
