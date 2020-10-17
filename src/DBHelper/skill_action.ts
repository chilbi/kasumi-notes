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

function getAtkKey(atkType: number) {
  // if(atkType === 2) {
  // let atkStr = '魔法攻撃力';
  let atkKey = 'magic_str';
  // }
  if (atkType === 1 || atkType === 3/*アキノ UB+ action_detail_1: 3*/) {
    // atkStr = '物理攻撃力';
    atkKey = 'atk';
  }
  return atkKey;
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
    const atkKey = getAtkKey(atkType);
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
  let action = actionList.find(item =>
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

function getSameDesc(action: SkillAction, actionList: SkillAction[]): string {
  let desc = '';
  const sameAction = actionList.find(item =>
    item.description !== '' &&
    item.action_id !== action.action_id &&
    item.action_type === action.action_type &&
    item.action_detail_1 === action.action_detail_1
  );
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

function getActionUp(action: SkillAction, actionValueN: number, factor: number, coefficient: string): [/*effect*/string, /*formula*/string] {
  let effect = '効果値';
  let formula = `${factor}*${coefficient}`;
  switch (action.action_type) {
    case 1:
      effect = 'ダメージ';
      if (actionValueN === 2) {
        formula += '*skill_level';
      } else if (actionValueN === 3) {
        formula += `*${getAtkKey(action.action_detail_1)}`;
      }
      break;
    case 8:
      // if(actionValueN === 3)
      effect = '効果時間'; // only action_value_3
      break;
    case 10:
      if (actionValueN === 3) {
        formula += '*skill_level';
      } else if (actionValueN === 4) {
        effect = '効果時間';
      }
  }
  return [effect, formula];
}

// TODO 实现所有SkillAction
const actionMap: Record</*action_type*/number, /*getDescription*/(this: SkillAction, skillLevel: number, property: Property, actionList: SkillAction[]) => DescData> = {
  // damage
  1: function (skillLevel, property, actionList) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, this.action_value_3, this.action_detail_1, property);
    let desc = this.description;
    if (desc === '') {
      desc = getBranchDesc(this.action_id, actionList);
      if (desc === '') {
        desc = getSameDesc(this, actionList);
      }
    }
    const str = '最大３キャラに各'; // シオリ Main1
    if (desc.indexOf(str) > -1) {
      desc = desc.replace(str, this.target_count + this.target_number + '番目に近い敵単体に');
    }
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
    let target = '味方単体に';
    if (this.target_count === 99 && this.target_range === 2160) target = '味方全体に';
    else if (this.target_type === 7 && this.target_count === 1) target = '自分に';
    return insertFormula(target + this.description, formula, getEffectTime(this.action_value_3));
  },
  // target_range_center ミソギ UB action1
  7: function () {
    let modifier = this.target_count + this.target_number + '番目';
    let target = this.target_assignment === 1 ? 'に近い敵' :/* this.target_assignment === 2*/ '前の味方';
    return modifier + target + 'を範囲の中心にする。';
  },
  // フィールド buff debuff
  8: function () {
    let desc = '';
    const akinesia = '一定時間行動不能';
    switch (this.action_detail_1) {
      case 1: // カスミ UB
        desc = this.description.replace('一定時間低下させる', `${this.action_value_1}倍にする`).replace('範囲内', this.target_range + '範囲内');
        break;
      case 2: // ユイ UB+
        desc = this.description.replace(/*行動速度*/'アップ', /*行動速度*/`を${this.action_value_1}倍にする`);
        break;
      case 3: // アオイ Main2
        desc = this.description.replace(akinesia, '麻痺状態').replace('範囲内', this.target_range + '範囲内');
        break;
      case 5: // カスミ Main1
        desc = this.description.replace(akinesia, '束縛状態').replace('範囲内', this.target_range + '範囲内');
        break;
      case 7: // マツリ Main1
        desc = this.description.replace(akinesia, 'スタン状態').replace('範囲内', this.target_range + '範囲内');
        break;
      default:
        desc = this.description;
    }
    return desc + getEffectTime(this.action_value_3);
  },
  9: function (skillLevel) {
    const fromula = getFormula(this.action_value_1, this.action_value_2, skillLevel);
    let target = '敵単体';
    if (this.target_range > -1 && this.target_range < 2160 && this.target_count > 1) {
      target = this.target_range + '範囲内の敵';
    }
    let state = this.action_detail_1 === 1 ? '毒' :/*this.action_detail_1 === 4*/ '猛毒';
    let desc = this.description.replace('{0}', `${target}を${state}状態にし、毎秒{0}`);
    return insertFormula(desc, fromula, getEffectTime(this.action_value_3));
  },
  // buff debuff
  10: function (skillLevel, property, actionList) {
    const formula = getFormula(this.action_value_2, this.action_value_3, skillLevel);
    let desc = this.description;
    if (desc === '') {
      desc = getSameDesc(this, actionList);
    }
    if (this.target_range > -1 && this.target_range < 2160 && this.target_count > 1) {
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
  // 召喚物 summoned
  15: function () {
    let target = '';
    // シノブ Main1
    if (this.target_type === 7) {
      target = '自分';
    }
    // チカ UB
    if (this.target_type === 10) {
      target = this.target_count + this.target_number + '番目前の味方';
    }
    if (this.action_value_7 > 0) {
      target += `の前${this.action_value_7}距離に`;
    } else {
      target += 'のそばに';
    }
    return target + this.description + '。';
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
  20: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, undefined, undefined, undefined, v => v);
    let target = '自分';
    if (this.target_type === 35) target = '対象の味方'; // ヨリ（エンジェル）
    const desc = target + 'を挑発状態にする、効果時間{0}秒';
    return insertFormula(desc, formula);
  },
  // ミヤコ　無敵状態
  21: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, undefined, undefined, undefined, v => v);
    return insertFormula('自分を無敵状態にする、効果時間{0}秒', formula);
  },
  23: function () {
    let actionA = getActionObj(getActionNum(this.action_detail_2));
    let actionB = getActionObj(getActionNum(this.action_detail_3));
    let target = '対象の';
    if (this.target_range > -1 && this.target_range < 2160 && this.target_count > 1) {
      target = this.target_range + '範囲内の';
    }
    target = target + (this.target_assignment === 1 ? '敵' : '味方');
    let state = '';
    // イオ Main1+ action_detail_1: 300, action_value_1: 0, action_value_2: 1
    if (this.action_detail_1 === 300) {
      state = '誘惑';
    }
    // アオイ Main1+ action_detail_1: 502, action_value_1: 1, action_value_2: 2
    if (this.action_detail_1 === 502) {
      state = '毒';
      [actionA, actionB] = [actionB, actionA];
    }
    return [`${target}に${state}状態を持っている場合`, actionA, 'を使う、持っていない場合', actionB, 'を使う。'];
  },
  26: function (skillLevel, property, actionList) {
    const actionNum = getActionNum(this.action_detail_1);
    const targetAction = actionList.find(item => item.action_id === this.action_detail_1)!;
    let coefficient: string;
    switch (this.action_value_1) {
      case 1:
        coefficient = '損失したHP'; // サレン UB
        break;
      case 4:
        coefficient = '範囲内の敵の数'; // カスミ Main+、トモ Main+
        break;
      default:
        coefficient = '???';
    }
    const [effect, formula] = getActionUp(targetAction, this.action_detail_2, this.action_value_2, coefficient);
    return [getActionObj(actionNum), `の${effect}を`, getFormulaObj(formula), 'アップする。'];
  },
  27: function (skillLevel, property, actionList) {
    const actionNum = getActionNum(this.action_detail_1);
    const targetAction = actionList.find(item => item.action_id === this.action_detail_1)!;
    let coefficient: string;
    switch (this.action_value_1) {
      case 2:
        coefficient = '倒した敵の数'; // 二ノン Main1
        break;
      default:
        coefficient = '???';
    }
    const [effect, formula] = getActionUp(targetAction, this.action_detail_2, this.action_value_2, coefficient);
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
  // アキノ UB+
  36: function (skillLevel, property) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, this.action_value_3, this.action_detail_1, property);
    return insertFormula('半径' + this.action_value_7 + this.description, formula, getEffectTime(this.action_value_5));
  },
  // アキノ Main2
  37: function (skillLevel, property) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, this.action_value_3, this.action_detail_1, property);
    return insertFormula('半径' + this.action_value_7 + this.description, formula, getEffectTime(this.action_value_5));
  },
  // カスミ UB
  38: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel);
    const desc = `半径${this.action_value_5}のフィールドを展開し、${this.description}`;
    return insertFormula(desc, formula, getEffectTime(this.action_value_3));
  },
  // アキノ Main1
  42: function () {
    const actionNum = getActionNum(this.action_detail_2);
    return [`${this.action_value_4}秒内ダメージを受けた場合、${this.action_value_1}%確率で`, getActionObj(actionNum), 'を使う。'];
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
