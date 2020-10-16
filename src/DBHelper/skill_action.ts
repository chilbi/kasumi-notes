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

function getFormula(
  constant: number,
  skillLevelFactor?: number,
  skillLevel?: number,
  propertyFactor?: number,
  atkType?: number,
  property?: Property,
  cb = (v: number) => Math.ceil(v)
): [/*calc*/number, /*formula*/string?] {
  let formula = constant.toString();
  let calc = constant;
  if (skillLevelFactor && skillLevel) {
    formula = (calc !== 0 ? `${formula}+` : '') + `${skillLevelFactor}*skill_level`;
    calc = cb(calc + skillLevelFactor * skillLevel);
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
    formula = (calc !== 0 ? `${formula}+` : '') +  `${propertyFactor}*${atkKey}`;
    calc += cb(propertyFactor * property[atkKey as keyof typeof property]);
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
  if (i < 0) return desc + last;
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
    if (this.target_range > -1 && this.target_range < 2160 && this.target_count > 1) {
      desc = desc.replace('範囲内', this.target_range + '範囲内');
    }
    if (this.action_value_6 !== 0) {
      desc += `、クリティカル時のダメージが2倍から${this.action_value_6 * 2}倍になる`;
    }
    if (this.action_value_5 !== 0) {
      desc += '、ダメージは必ずクリティカルする';
    }
    return insertFormula(desc, formula);
  },
  // マツリ UB、ミミ UB
  2: function () {
    let desc = this.target_count + this.target_number + '番目に近い敵の目の前に移動する。';
    return desc;
  },
  // knockback
  3: function () {
    let target = this.target_range > -1 && this.target_range < 2160 && this.target_count > 1
      ? this.target_range + '範囲内の敵'
      : '敵単体';
    let direction = this.action_detail_1 === 3 ? '距離ノックバック' :/*this.action_detail_1 === 3 ?*/ '高度ノックアップ';
    return target + 'を' + this.action_value_1 + direction + 'する。';
  },
  // heal
  4: function (skillLevel, property) {
    const formula = getFormula(this.action_value_2, this.action_value_3, skillLevel, this.action_value_4, this.action_detail_1, property);
    let desc = this.description;
    if (this.target_range > -1 && this.target_range < 2160 && this.target_count > 1) {
      desc = desc.replace('範囲内', this.target_range + '範囲内');
    }
    return insertFormula(desc, formula);
  },
  // barrier
  6: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel);
    return insertFormula(this.description, formula, getEffectTime(this.action_value_3));
  },
  // target_range_center ミソギ UB action1
  7: function () {
    return this.target_count + this.target_number + '番目に近い敵を範囲の中心にする。';
  },
  // フィールド buff debuff
  8: function () {
    let desc = '';
    switch (this.action_detail_1) {
      case 1: // カスミ UB
        desc = this.description.replace('一定時間低下させる', `${this.action_value_1}倍にする`).replace('範囲内', this.target_range + '範囲内');
        break;
      case 2: // ユイ UB+
        desc = this.description.replace(/*行動速度*/'アップ', /*行動速度*/`を${this.action_value_1}倍にする`);
        break;
      case 5: // カスミ Main1
        desc = this.description.replace('一定時間行動不能', '束縛状態').replace('範囲内', this.target_range + '範囲内');
        break;
      case 7: // マツリ Main1
        desc = this.description.replace('一定時間行動不能', 'スタン状態').replace('範囲内', this.target_range + '範囲内');
        break;
      default:
        desc = this.description;
    }
    return desc + getEffectTime(this.action_value_3);
  },
  9: function (skillLevel) {
    const fromula = getFormula(this.action_value_1, this.action_value_2, skillLevel);
    let target = this.target_range > -1 && this.target_range < 2160 && this.target_count > 1
      ? this.target_range + '範囲内の敵'
      : '敵単体';
    let desc = target + 'を毒状態にし、毎秒' + this.description;
    return insertFormula(desc, fromula, getEffectTime(this.action_value_3));
  },
  // buff debuff
  10: function (skillLevel, property, actionList) {
    const formula = getFormula(this.action_value_2, this.action_value_3, skillLevel);
    let desc = this.description;
    if (desc === '') {
      desc = getSameDesc(this.action_id, this.action_detail_1, actionList);
    }
    if (this.target_range > -1 && this.target_count > 1) {
      desc = desc.replace('範囲内', this.target_range + '範囲内');
    }
    return insertFormula(desc, formula, getEffectTime(this.action_value_4));
  },
  // 誘惑、混乱
  11: function () {
    let desc = this.description;
    if (this.action_detail_1 === 1) {
      // カスミ Main2
      desc = desc.replace('混乱させる', this.action_value_3 * 100 + '%確率で混乱状態にする');
    } else {
      // ユキ Main+、イオ UB
      desc = desc.replace('誘惑する', this.action_value_3 + '%確率で誘惑状態にする');
    }
    return desc + getEffectTime(this.action_value_1);
  },
  // 暗闇
  12: function () {
    return this.description.replace('暗闇', this.action_value_3 + '%確率で暗闇')  + getEffectTime(this.action_value_1);
    // const actionObj = getActionObj(getActionNum(this.action_id) - 1);
    // return [
    //   actionObj,
    //   `にダメージを与えられたターゲットを${this.action_value_3}%確率で${this.description + getEffectTime(this.action_value_1)}` +
    //   `物理攻撃は${100 - this.action_detail_1}%確率でミスする。`
    // ];
  },
  16: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel);
    return insertFormula(this.description, formula);
  },
  // アンナ Main2 action1
  17: function () {
    return '自分のHPが最大HPの' + this.action_value_3 + '%以下になった時に発動する。';
  },
  // レイ　構え中に受けたダメージ
  18: function () {
    const formula = this.action_value_1 + '*受けたダメージ';
    const actionNum = getActionNum(this.action_detail_2);
    return [`攻撃前の${this.action_value_3}秒構え中に受けたダメージに応じて、`, getActionObj(actionNum), '与えるダメージが', getFormulaObj(formula), 'アップする。'];
  },
  // 挑発
  20: function () {
    let target = '自分';
    if (this.target_type === 35) target = '対象の味方'; // ヨリ（エンジェル）
    return target + 'を挑発状態にする' + getEffectTime(this.action_value_1);
  },
  // ミヤコ　無敵状態
  21: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, undefined, undefined, undefined, v => v);
    return insertFormula('自分を無敵状態にする、効果時間{0}秒', formula);
  },
  // イオ Main1+
  23: function () {
    const actionA = getActionObj(getActionNum(this.action_detail_2));
    const actionB = getActionObj(getActionNum(this.action_detail_3));
    // action_detail_1: 300, action_value_2: 1
    return [this.target_range + '範囲内の敵に、誘惑状態を持っている場合', actionA, 'を使う、持っていない場合', actionB, 'を使う。'];
  },
  26: function (skillLevel, property, actionList) {
    const actionNum = getActionNum(this.action_detail_1);
    const targetAction = actionList.find(item => item.action_id === this.action_detail_1)!;
    const actionValueMap: Record</*action_type*/number, /*effect*/string> = {
      1: 'ダメージ',
      8: '効果時間',
      // 10: '効果数値',
    };
    const effect = actionValueMap[targetAction.action_type] || '効果数値';
    const coefficient: Record</*this.action_value_1*/number, /*coefficient*/string> = {
      1: '損失したHP', // サレン UB
      4: '範囲内の敵の数', // カスミ Main+
    };
    const formula = `${this.action_value_2}*${coefficient[this.action_value_1] || ''}`;
    return [getActionObj(actionNum), `の${effect}を`, getFormulaObj(formula), 'アップする。'];
  },
  27: function (skillLevel, property, actionList) {
    const actionNum = getActionNum(this.action_detail_1);
    const targetAction = actionList.find(item => item.action_id === this.action_detail_1)!;
    const actionValueMap: Record</*action_type*/number, /*effect*/string> = {
      // 16: '効果数値',
    };
    const effect = actionValueMap[targetAction.action_type] || '効果数値';
    const coefficient: Record</*this.action_value_1*/number, /*coefficient*/string> = {
      2: '倒した敵の数', // 二ノン
    };
    const formula = `${this.action_value_2}*${coefficient[this.action_value_1] || ''}`;
    return [getActionObj(actionNum), `の${effect}を`, getFormulaObj(formula), 'で乗じる。'];
  },
  28: function () {
    const actionA = getActionObj(getActionNum(this.action_detail_2));
    const actionB = getActionObj(getActionNum(this.action_detail_3));
    if (this.action_detail_1 === 1000) {
      // エリコ UB
      return ['敵を倒した場合', actionA, 'を使う。']
    } else if (this.action_detail_1 > 100) {
      const stateID = parseInt(this.action_detail_1.toString().substr(1)); // 77 レイ 風の刃
      const stateData = state[stateID];
      if (stateData) {
        // レイ Main1 Main2
        return ['自分に', getStateObj(stateID), 'を持っていない場合', actionB, 'を使う、持っている場合', actionA, 'を使う。'];
      }
    } else {
      // スズメ UB
      return [`${this.action_detail_1}%確率で`, actionA, `を使う、${100 - this.action_detail_1}%確率で`, actionB, 'を使う。'];
    }
    return this.description;
  },
  // アンナ Main2 action3
  30: function () {
    return '自分を戦闘不能状態にする。';
  },
  // アカリ UB hp吸収付与
  32: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel);
    return ['味方全体の次の攻撃に' + formula[0], getFormulaObj(formula[1]!), 'HP吸収効果を付与する。'];
  },
  // カオリ Main2
  34: function (skillLevel) {
    const formula = getFormula(this.action_value_2, this.action_value_3, skillLevel);
    return insertFormula(this.description, formula, '、効果は最大' + this.action_value_4 + '回まで累積する。');
  },
  // レイ UB+
  35: function () {
    const stateData = state[this.action_value_2];
    if (stateData) {
      const stateObj = getStateObj(this.action_value_2);
      return ['自分に', stateObj, 'を付与し、'/*, stateObj , 'を持っている間、'*/ + stateData.effect + getEffectTime(this.action_value_3)];
    }
    return this.description + '。';
  },
  // カスミ UB
  38: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel);
    const desc = `半径${this.action_value_5}のフィールドを展開し、${this.description}`;
    return insertFormula(desc, formula, getEffectTime(this.action_value_3));
  },
  // HP/TP継続回復状態付与
  48: function (skillLevel, property) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, this.action_value_3, this.action_detail_1, property);
    let target = '';
    if (this.target_count === 1) target = '味方単体';
    else if (this.target_count === 99) target = '味方全体';
    return insertFormula(target + this.description, formula, getEffectTime(this.action_value_5));
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
