import { Property } from './property';

interface OtherProperty {
  skill_lv: number; // 10.0
  exskill_evolution: number; // 15.0
  overall: number; // 1.0
  skill1_evolution: number; // 10
  skill1_evolution_slv: number; // 1.2
  ub_evolution: number; // 200
  ub_evolution_slv: number; // 1.5
}

export function getFightingCapacity(property: Property/*, other: OtherProperty*/) {
  return Math.ceil(
    property.hp * 0.1 +
    property.atk * 1.0 +
    property.magic_str * 1.0 +
    property.def * 4.5 +
    property.magic_def * 4.5 +
    property.physical_critical * 0.5 +
    property.magic_critical * 0.5 +
    property.wave_hp_recovery * 0.1 +
    property.wave_energy_recovery * 0.3 +
    property.dodge * 6.0 +
    property.physical_penetrate * 6.0 +
    property.magic_penetrate * 6.0 +
    property.life_steal * 4.5 +
    property.hp_recovery_rate * 1.0 +
    property.energy_recovery_rate * 1.5 +
    property.energy_reduce_rate * 3.0 +
    property.accuracy * 2.0 
  );
}

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

export function getImageUrl(type: ImagePathType, imageName: string) {
  let path = '';
  switch (type) {
    case 'plate':
    case 'unit':
    case 'unit_shadow':
    case 'equipment':
    case 'item':
    case 'skill':
      path = `icon/${type}/${imageName}.webp`;
      break;
    case 'full':
    case 'profile':
    case 'actual_profile':
    case 'story':
      path = `/card/${type}/${imageName}.webp`;
      break;
  }
  return 'https://redive.estertion.win/' + path;
}

type PublicImagePathType = /*'common' | */'icon_unit' | 'unit_plate' | 'still_unit' | 'skill' | 'equipment' | 'state' | 'thumb_story'/* | 'item'*/;

export function getPublicImageURL(type: PublicImagePathType, name: string | number): string {
  let path = '';
  switch (type) {
    case 'icon_unit':
      path = 'icon/unit/icon_unit_' + name;
      break;
    case 'skill':
      path = 'icon/skill/icon_skill_' + name;
      break;
    case 'equipment':
      path = 'icon/equipment/icon_equipment_' + name;
      break;
    case 'state':
      path = 'icon/state/' + name;
      break;
    // case 'item':
    //   path = 'icon/item/icon_item_' + name;
    //   break;
    // case 'common':
    //   path = 'common/' + name;
    //   break;
    case 'unit_plate':
      path = 'unit_plate/unit_plate_' + name;
      break;
    case 'still_unit':
      path = 'still_unit/still_unit_' + name;
      break;
    case 'thumb_story':
      path = 'thumb/story/thumb_story_' + name;
      break;
  }
  return `${process.env.PUBLIC_URL}/images/${path}.png`;
}
