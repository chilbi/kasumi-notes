import { PCRDB } from '../db';
import { Property } from './property';

export interface SkillAction {
  action_id: number;
  class_id: number;
  action_type: number;
  action_detail_1: number;
  action_detail_2: number;
  action_detail_3: number;
  action_value_1: number;
  action_value_2: number;
  action_value_3: number;
  action_value_4: number;
  action_value_5: number;
  action_value_6: number;
  action_value_7: number;
  target_assignment: number;
  target_area: number;
  target_range: number;
  target_type: number;
  target_number: number;
  target_count: number;
  description: string;
  level_up_disp: string;
  getDescription(skillLevel: number, property: Property): string;
}

function getFormula(constant: number): string;
function getFormula(constant: number, skillLevelFactor: number, skillLevel: number): string;
function getFormula(constant: number, skillLevelFactor: number, skillLevel: number, propertyFactor: number, atkType: number, property: Property): string;
function getFormula(constant: number, skillLevelFactor?: number, skillLevel?: number, propertyFactor?: number, atkType?: number, property?: Property): string {
  let calc = constant;
  let formula = constant.toString();
  if (skillLevelFactor && skillLevel) {
    calc = Math.ceil(calc + skillLevelFactor * skillLevel);
    formula += `+${skillLevelFactor}*skill_level`;
  }
  if (propertyFactor && atkType && property) {
    // if(atkType === 2) {
    // let atkStr = '魔法攻撃力';
    let atkKey = 'magic_str';
    // }
    if (atkType === 1) {
      // atkStr = '物理攻撃力';
      atkKey = 'atk';
    }
    calc += Math.ceil(propertyFactor * property[atkKey as keyof typeof property]);
    formula += `+${propertyFactor}*${atkKey}`;
  }
  return calc.toString() === formula ? formula : `${calc}「${formula}」`;
}

// TODO 实现所有SkillAction
const actionMap: Record</*action_type*/number, /*getDescription*/(this: SkillAction, skillLevel: number, property: Property) => string> = {
  // damage
  1: function (skillLevel, property) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, this.action_value_3, this.action_detail_1, property);
    let desc = this.description.replace('{0}', formula);
    if (this.target_area === 2 && this.target_count === 99/* && this.target_range > -1*/) {
      desc = desc.replace('範囲内', `${this.target_range}範囲内`);
    }
    return desc;
  },
  // knockback
  3: function () {
    return `敵単体を${this.action_value_1}距離ノックバックする`;
  },
  // heal
  4: function (skillLevel, property) {
    const formula = getFormula(this.action_value_2, this.action_value_3, skillLevel, this.action_value_4, this.action_detail_1, property);
    return this.description.replace('{0}', formula);
  },
  // barrier
  6: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel);
    let desc = this.description.replace('{0}', formula);
    desc = this.action_value_3 + '秒内に' + desc;
    return desc;
  },
  // speed up
  8: function () {
    let desc = this.description.replace('アップ', `を${this.action_value_1}倍にする`);
    desc = this.action_value_3 + '秒内に' + desc;
    return desc;
  },
  // buff
  10: function (skillLevel) {
    const formula = getFormula(this.action_value_2, this.action_value_3, skillLevel);
    let desc = this.description.replace('{0}', formula);
    desc = this.action_value_4 + '秒内に' + desc;
    return desc;
  },
  // ex
  90: function (skillLevel) {
    const formula = getFormula(this.action_value_2, this.action_value_3, skillLevel);
    return this.description.replace('{0}', formula);
  },
}

export function getDescription(this: SkillAction, skillLevel: number, property: Property): string {
  // if (this.description === '') {
  //   console.log(this);
  // }
  const getDesc = actionMap[this.action_type];
  return getDesc ? getDesc.call(this, skillLevel, property) + '。' : this.description;
}

export async function getSkillAction(db: PCRDB, action_id: number): Promise<SkillAction> {
  const skillAction = await db.transaction('skill_action', 'readonly').store.get(action_id);
  if (!skillAction) throw new Error(`objectStore('skill_action').get(/*action_id*/${action_id}) => undefined`);
  const data = skillAction as SkillAction;
  data.getDescription = getDescription.bind(data);
  return data;
}
