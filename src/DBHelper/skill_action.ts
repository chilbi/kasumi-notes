import { PCRDB } from '../db';
import { state } from './state';
import { Property } from './property';

export interface DescObj {
  type: 'formula' | 'action' | 'state';
  value: number | string;
};

export type DescType = number | string | DescObj;

export type DescData = DescType | DescType[];

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
  getDescData(skillLevel: number, property: Property, actionList: SkillAction[]): DescData;
}

function getFormula(constant: number, skillLevelFactor?: number, skillLevel?: number, propertyFactor?: number, atkType?: number, property?: Property): [/*calc*/number, /*formula*/string?] {
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
  return calc.toString() === formula ? [calc] : [calc, formula];
}

function getEffectTime(time: number): string {
  return `、効果時間${time}秒。`;
}

function getBranchDesc(actionID: number, actionList: SkillAction[]): string {
  let desc = '';
  const action = actionList.find(item =>
    (item.action_detail_2 === actionID && item.action_detail_3 !== 0)
    ||
    (item.action_detail_3 === actionID && item.action_detail_2 !== 0)
  );
  if (action) {
    const branchActionID = action.action_detail_3 === actionID ? action.action_detail_2 : action.action_detail_3;
    const branchAction = actionList.find(item => item.action_id === branchActionID);
    if (branchAction) {
      desc = branchAction.description;
    }
  }
  return desc;
}

function getSameDesc(actionID: number, actionDetail1: number, actionList: SkillAction[]): string {
  let desc = '';
  const sameAction = actionList.find(item => item.action_id !== actionID && item.action_detail_1 === actionDetail1);
  if (sameAction) {
    desc = sameAction.description;
  }
  return desc;
}

function getActionNum(actionID: number): number {
  return actionID % 10;
}

function getActionObj(value: number | string): DescObj {
  return { type: 'action', value };
}

function getStateObj(value: number | string): DescObj {
  return { type: 'state', value };
}

function getFormulaObj(value: number | string): DescObj {
  return { type: 'formula', value };
}

function insertFormula(desc: string, formula: [/*calc*/number, /*formula*/string?], last = '。', placeholder = '{0}'): DescData {
  const i = desc.indexOf(placeholder);
  const part1 = desc.substring(0, i) + formula[0];
  const part2 = desc.substr(i + placeholder.length) + last;
  const value = formula[1];
  if (value) return [part1, getFormulaObj(value), part2];
  return part1 + part2;
}

// TODO 实现所有SkillAction
const actionMap: Record</*action_type*/number, /*getDescription*/(this: SkillAction, skillLevel: number, property: Property, actionList: SkillAction[]) => DescData> = {
  // damage
  1: function (skillLevel, property, actionList) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, this.action_value_3, this.action_detail_1, property);
    let desc = this.description;
    desc = desc === '' ? getBranchDesc(this.action_id, actionList) : desc;
    if (this.target_area === 2 && this.target_count === 99/* && this.target_range > -1*/) {
      desc = desc.replace('範囲内', `${this.target_range}範囲内`);
    }
    return insertFormula(desc, formula);
  },
  // knockback
  3: function () {
    return `敵単体を${this.action_value_1}距離ノックバックする。`;
  },
  // heal
  4: function (skillLevel, property) {
    const formula = getFormula(this.action_value_2, this.action_value_3, skillLevel, this.action_value_4, this.action_detail_1, property);
    return insertFormula(this.description, formula);
  },
  // barrier
  6: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel);
    return insertFormula(this.description, formula, getEffectTime(this.action_value_3));
  },
  // speed up
  8: function () {
    return this.description.replace('アップ', `を${this.action_value_1}倍にする`) + getEffectTime(this.action_value_3);
  },
  // buff debuff
  10: function (skillLevel, property, actionList) {
    const formula = getFormula(this.action_value_2, this.action_value_3, skillLevel);
    let desc = this.description;
    desc = desc === '' ? getSameDesc(this.action_id, this.action_detail_1, actionList) : desc;
    return insertFormula(desc, formula, getEffectTime(this.action_value_4));
  },
  // レイ　構え中に受けたダメージ
  18: function () {
    const formula = this.action_value_1 + '*受けたダメージ';
    const actionNum = getActionNum(this.action_detail_2);
    return [`攻撃前の${this.action_value_3}秒構え中に受けたダメージに応じて、`, getActionObj(actionNum), '与えるダメージが', getFormulaObj(formula), 'アップする。'];
  },
  28: function () {
    let descData: DescData;
    const stateID = parseInt(this.action_detail_1.toString().substr(1)); // 77 レイ 風の刃
    const stateData = state[stateID];
    if (stateData) {
      const actionA = getActionNum(this.action_detail_2);
      const actionB = getActionNum(this.action_detail_3);
      descData = [getStateObj(stateID), 'を持っていない場合', getActionObj(actionB), 'を使う。持っている場合', getActionObj(actionA), 'を使う。'];
    } else {
      descData = this.description + '。';
    }
    return descData;
  },
  35: function () {
    const stateData = state[this.action_value_2];
    if (stateData) {
      const stateObj = getStateObj(this.action_value_2);
      return ['自分に', stateObj, 'を追加する。', stateObj , 'を持っている間、' + stateData.effect + getEffectTime(this.action_value_3)];
    }
    return this.description + '。';
  },
  // ex
  90: function (skillLevel) {
    const formula = getFormula(this.action_value_2, this.action_value_3, skillLevel);
    return insertFormula(this.description, formula);
  },
}

export function getDescData(this: SkillAction, skillLevel: number, property: Property, actionList: SkillAction[]): DescData {
  const getDesc = actionMap[this.action_type];
  return getDesc ? getDesc.call(this, skillLevel, property, actionList) : this.description;
}

export async function getSkillAction(db: PCRDB, action_id: number): Promise<SkillAction> {
  const skillAction = await db.transaction('skill_action', 'readonly').store.get(action_id);
  if (!skillAction) throw new Error(`objectStore('skill_action').get(/*action_id*/${action_id}) => undefined`);
  const data = skillAction as SkillAction;
  data.getDescData = getDescData.bind(data);
  return data;
}
