import { PCRDB } from '../db';
import { getSkillAction, SkillAction } from './skill_action';

export type SkillEnhanceStatus = Record</*skill*/'ub' | 1 | 2 | 'ex', /*enhance_level*/number>;

export interface AttackPattern {
  loop_start: number;
  loop_end: number;
  atk_pattern: number[]; // 1 | 1001 | 1002 | 2001 | 2002 | 2003 | 200...  // 1-20
}

export interface SkillData {
  skill_id: number;
  name: string;
  // skill_type: number;
  // skill_area_width: number;
  skill_cast_time: number;
  description: string;
  icon_type: number;
  action: SkillAction[]; // 1-7
  // depend_action: SkillAction[]; // 1-7
}

export interface UnitSkillData {
  unit_id: number;
  attack_pattern: AttackPattern[];
  union_burst: SkillData;
  union_burst_evolution: SkillData | undefined;
  sp_union_burst: SkillData | undefined;
  main_skill: SkillData[]; // 1-10
  main_skill_evolution: SkillData[]; // 1-2
  ex_skill: SkillData[]; // 1-5
  ex_skill_evolution: SkillData[]; // 1-5
  sp_skill: SkillData[]; // 1-5
  sp_skill_evolution: SkillData[]; // 1-5
}

async function getAttackPattern(db: PCRDB, unit_id: number): Promise<AttackPattern[]> {
  const unitAttackPattern = await db.transaction('unit_attack_pattern', 'readonly').store.index('unit_attack_pattern_0_unit_id').getAll(unit_id);
  return unitAttackPattern.map(item => {
    const atk_pattern: number[] = [];
    let i = 1;
    let value = 0;
    while (i <= 20) {
      value = item['atk_pattern_' + i as keyof typeof item];
      if (value === 0) break;
      atk_pattern.push(value);
      i++;
    }
    return {
      loop_start: item.loop_start,
      loop_end: item.loop_end,
      atk_pattern,
    };
  });
}

async function getSkillData(db: PCRDB, skill_id: number): Promise<SkillData> {
  const skillData = await db.transaction('skill_data', 'readonly').store.get(skill_id);
  if (!skillData) throw new Error(`objectStore('skill_data').get(/*skill_id*/${skill_id}) => undefined`);

  const getSkillActionArr = (prefix: string, max: number, min = 1): Promise<SkillAction[]> => {
    let i = min;
    let id = 0;
    const promiseArr = [];
    while (i <= max) {
      id = skillData[prefix + i as keyof typeof skillData] as number;
      if (id === 0) break;
      promiseArr.push(getSkillAction(db, id));
      i++;
    }
    return Promise.all(promiseArr);
  };

  // const [action, depend_action] = await Promise.all([
  //   getSkillActionArr('action_', 7),
  //   getSkillActionArr('depend_action_', 7)
  // ]);

  const action = await getSkillActionArr('action_', 7);

  return {
    skill_id: skillData.skill_id,
    name: skillData.name,
    // skill_type: skillData.skill_type,
    // skill_area_width: skillData.skill_area_width,
    skill_cast_time: skillData.skill_cast_time,
    description: skillData.description,
    icon_type: skillData.icon_type,
    action,
    // depend_action,
  };
}

// export function getUnitSkillProperty(this: UnitSkillData, skillEnhanceStatus: SkillEnhanceStatus): Property {}

export async function getUnitSkillData(db: PCRDB, unit_id: number): Promise<UnitSkillData> {
  const unitSkillData = await db.transaction('unit_skill_data', 'readonly').store.get(unit_id);
  if (!unitSkillData) throw new Error(`objectStore('unit_skill_data').get(/*unit_id*/${unit_id}) => undefined`);

  const getSkillDataArr = (prefix: string, max: number, min = 1): Promise<SkillData[]> => {
    let i = min;
    let id = 0;
    const promiseArr = [];
    while (i <= max) {
      id = unitSkillData[prefix + i as keyof typeof unitSkillData];
      if (id === 0) break;
      promiseArr.push(getSkillData(db, id));
      i++;
    }
    return Promise.all(promiseArr);
  };

  const [
    attack_pattern,
    union_burst,
    union_burst_evolution,
    sp_union_burst,
    main_skill,
    main_skill_evolution,
    ex_skill,
    ex_skill_evolution,
    sp_skill,
    sp_skill_evolution,
  ] = await Promise.all([
    getAttackPattern(db, unit_id),
    getSkillData(db, unitSkillData.union_burst),
    unitSkillData.union_burst_evolution === 0 ? undefined : getSkillData(db, unitSkillData.union_burst_evolution),
    unitSkillData.sp_union_burst === 0 ? undefined : getSkillData(db, unitSkillData.sp_union_burst),
    getSkillDataArr('main_skill_', 10),
    getSkillDataArr('main_skill_evolution_', 2),
    getSkillDataArr('ex_skill_', 5),
    getSkillDataArr('ex_skill_evolution_', 5),
    getSkillDataArr('sp_skill_', 5),
    getSkillDataArr('sp_skill_evolution_', 2)
  ]);

  return {
    unit_id,
    attack_pattern,
    union_burst,
    union_burst_evolution,
    sp_union_burst,
    main_skill,
    main_skill_evolution,
    ex_skill,
    ex_skill_evolution,
    sp_skill,
    sp_skill_evolution,
  };
}
