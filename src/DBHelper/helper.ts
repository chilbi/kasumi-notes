// import { Property } from './property';
// import Big from 'big.js';

// interface OtherProperty {
//   skill_lv: number; // 10.0
//   exskill_evolution: number; // 15.0
//   overall: number; // 1.0
//   skill1_evolution: number; // 10
//   skill1_evolution_slv: number; // 1.2
//   ub_evolution: number; // 200
//   ub_evolution_slv: number; // 1.5
// }

// export function getFightingCapacity(property: Property/*, other: OtherProperty*/): number {
//   return [
//     [property.hp, 0.1],
//     [property.atk, 1.0],
//     [property.magic_str, 1.0],
//     [property.def, 4.5],
//     [property.magic_def, 4.5],
//     [property.physical_critical, 0.5],
//     [property.magic_critical, 0.5],
//     [property.wave_hp_recovery, 0.1],
//     [property.wave_energy_recovery, 0.3],
//     [property.dodge, 6.0],
//     [property.physical_penetrate, 6.0],
//     [property.magic_penetrate, 6.0],
//     [property.life_steal, 4.5],
//     [property.hp_recovery_rate, 1.0],
//     [property.energy_recovery_rate, 1.5],
//     [property.energy_reduce_rate, 3.0],
//     [property.accuracy, 2.0]
//   ].reduce((calc, item) => calc.plus(Big(item[0]).times(item[1])), Big(0)).toNumber();
// }

export function getRankPoint(p: number) {
  if (p >= 18) {
    return 18;
  } else if (p >= 11 && p < 18) {
    return 11;
  } else if (p >= 7 && p < 11) {
    return 7;
  } else if (p >= 4 && p < 7) {
    return 4;
  } else if(p >= 2 && p < 4) {
    return 2;
  } else {
    return 1;
  }
}

export function getSubID(unitID: number): string {
  return unitID.toString().substr(0, 4);
}

export function getCharaID(unitID: number) {
  return parseInt(getSubID(unitID));
}

export function compareSubID(a: number, b: number): boolean {
  return getSubID(a) === getSubID(b);
}

export function getValidID(unitID: number, rarity = 3, last = 1): string {
  rarity = rarity < 3 ? 1 : rarity > 3 && rarity < 6 ? 3 : rarity;
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

type PublicImagePathType = 'icon_equipment' | 'icon_skill' | 'icon_state' | 'icon_unit' | 'still_unit' | 'thumb_story' | 'unit_plate';

export function getPublicImageURL(type: PublicImagePathType, name: string | number): string {
  return `${process.env.PUBLIC_URL}/images/${type}/${type}_${name}.png`;
}
