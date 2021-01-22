import { PCRDB } from '../db';
import { Property } from './property';
import Big from 'big.js';

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
  getDescData(skillLevel: number, property: Property, actionList: SkillAction[]): DescData;
}

const mapStr: Record<string, string> = {
  atk: '物攻',
  magic_str: '魔攻',
  skill_level: 'Lv',
};

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
  cb = (v: Big) => v.round(0, 3)
): [/*calc*/number, /*formula*/string?] {
  let formula = constant.toString();
  let calc = Big(constant);
  let flag = false;
  if (skillLevelFactor && skillLevel) {
    formula = (!calc.eq(0) ? `${formula}+` : '') + `${skillLevelFactor}×${mapStr['skill_level']}`;
    calc = Big(skillLevelFactor).times(skillLevel).plus(calc);
    flag = true;
  }
  if (propertyFactor && atkType && property) {
    const atkKey = getAtkKey(atkType);
    formula = (!calc.eq(0) ? `${formula}+` : '') + `${propertyFactor}×${mapStr[atkKey]}`;
    calc = calc.plus(Big(propertyFactor).times(property[atkKey as keyof typeof property]));
    flag = true;
  }
  if (flag) calc = cb(calc);
  return calc.toString() === formula ? [calc.toNumber()] : [calc.toNumber(), formula];
}

function getOdds(value: number): string {
  return value === 100 ? '' : `${value}%確率で`;
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

function getSameDesc(action: SkillAction, actionList: SkillAction[], detail = false): string {
  let desc = '';
  const sameAction = actionList.find(item =>
    item.description !== '' &&
    item.action_id !== action.action_id &&
    item.action_type === action.action_type &&
    (detail || item.action_detail_1 === action.action_detail_1)
  );
  if (sameAction) {
    desc = sameAction.description;
  }
  return desc;
}

function getSkillNickname(actionID: number): string {
  const n = parseInt(actionID.toString().substr(-3, 1));
  return n === 1 ? 'ユニオンバースト' : n === 2 ? 'スキル1' : 'スキル2';
}

function getState(actionDetail1: number): number {
  return parseInt(actionDetail1.toString().substr(1));
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

function insertFormula(desc: string, formula: [/*calc*/number | string, /*formula*/string?], last = '。', placeholder = '{0}'): DescData {
  const i = desc.indexOf(placeholder);
  if (i < 0) return desc + last;
  const part1 = desc.substring(0, i) + formula[0];
  const part2 = desc.substr(i + placeholder.length) + last;
  const value = formula[1];
  if (value) return [part1, getFormulaObj(value), part2];
  return part1 + part2;
}

function getCoefficient(thisAction: SkillAction): string {
  const actionValue1 = thisAction.action_value_1;
  if (actionValue1 === 290) return 'UBの使用回数';
  if (actionValue1 > 200 && actionValue1 < 300) return `{${actionValue1.toString().substr(1)}}の数`; //　クロエ Main2
  switch (actionValue1) {
    case 0:
      return '残りＨＰ'; // ぺコリーヌ UB+
    case 1:
      return '損失したＨＰ'; // サレン UB
    case 2:
      return '倒した敵の数'; // 二ノン UB+ Main1
    case 4:
      let range = thisAction.target_range === 2160 && thisAction.target_count === 99 ? '全体' : '範囲内';
      let target = thisAction.target_assignment === 1 ? '敵' : '味方';
      return `${range}の${target}の数`; // カスミ Main+、トモ Main+、リノ（ワンダー）
    case 5: // スズメ（ニューイヤー）
      return 'ダメージを与えた敵の数';
    case 6: // キャル（ニューイヤー）
      return 'ダメージの量';
    case 7: // ジュン（サマー）
      return '自分の物理攻撃力';
    case 8:
      return '自分の魔法攻撃力'; // チカ（クリスマス） Main1+
    case 12:
      return '後方にいる味方の数'; // ノゾミ（クリスマス）
    case 102:
      return 'オメメちゃんの数';
    default:
      return '???';
  }
}

function getEffectModified(thisAction: SkillAction, targetAction: SkillAction): [/*effect*/string, /*formula*/string] {
  const coefficient = getCoefficient(thisAction);
  const action_value_ = thisAction.action_detail_2;
  let factor = thisAction.action_value_2.toString();
  if (thisAction.action_value_3 !== 0) {
    factor = `(${factor}+${thisAction.action_value_3}×${mapStr['skill_level']})`;
  }
  let effect = '効果値';
  let formula = `${factor}×${coefficient}`;
  switch (targetAction.action_type) {
    case 1:
      effect = 'ダメージ';
      if (action_value_ === 2)
        formula += `×${mapStr['skill_level']}`;
      else if (action_value_ === 3)
        formula += `×${mapStr[getAtkKey(targetAction.action_detail_1)]}`;
      break;
    case 4:
      if (action_value_ === 3)
        formula += `×${mapStr['skill_level']}`;
      else if (action_value_ === 4)
        formula += `×${mapStr[getAtkKey(targetAction.action_detail_1)]}`;
      break;
    case 8:
      if (action_value_ === 3)
        effect = '効果時間';
      break;
    case 10:
      if (action_value_ === 3)
        formula += `×${mapStr['skill_level']}`;
      else if (action_value_ === 4)
        effect = '効果時間';
      break;
    // case 16: // only action_value_1
    //   break;
    case 48:
      if (action_value_ === 2)
        formula += `×${mapStr['skill_level']}`;
      else if (action_value_ === 3)
        formula += `×${mapStr[getAtkKey(targetAction.action_detail_1)]}`;
      break;
  }
  return [effect, formula];
}

// TODO 实现所有SkillAction
const actionMap: Record</*action_type*/number, /*getDescription*/(this: SkillAction, skillLevel: number, property: Property, actionList: SkillAction[]) => DescData> = {
  // damage
  1: function (skillLevel, property, actionList) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, this.action_value_3, this.action_detail_1, property, v => v.round(0, 1));
    let desc = this.description;
    if (this.target_type === 7) {
      desc = `自分に{0}の${this.action_detail_1 === 2 ? '魔法' : '物理'}ダメージ`;
    } else {
      if (desc === '') {
        desc = getBranchDesc(this.action_id, actionList);
        if (desc === '') {
          desc = getSameDesc(this, actionList);
          if (desc === '') {
            desc = getSameDesc(this, actionList, true);
          }
        }
      }
      let str = '最大３キャラに各'; // シオリ Main1
      if (desc.indexOf(str) > -1) {
        desc = desc.replace(str, this.target_count + this.target_number + '番目に近い敵単体に');
      }
      str = 'を３回与える';
      if (desc.indexOf(str) > -1) { // スズナ Main1
        desc = desc.replace(str, '');
      }
      if (this.target_range > 0 && this.target_range < 2160/* && this.target_count > 1 ミサキ Main2 target_count: 0*/) {
        if (this.action_id === 106110201) // ムイミ SP2
          desc = desc.replace('敵単体', this.target_range + '範囲内の敵');
        else
          desc = desc.replace('範囲内', this.target_range + '範囲内');
      }
      if (this.action_value_6 !== 0 && this.action_value_6 !== 1) {
        desc += `、クリティカル時のダメージは2倍ではなく${this.action_value_6 * 2}倍になる`;
      }
      if (this.action_detail_1 === 3 && this.action_detail_2 === 1 && this.action_value_5 === 1) {
        desc += '、攻撃は必ず命中し、1ヒットのダメージはクリティカルする'
      } else {
        if (this.action_detail_1 === 3 && this.action_detail_2 === 1)
          desc += '、攻撃は必ず命中する';
        if (this.action_value_5 === 1)
          desc += '、1ヒットのダメージは必ずクリティカルする';
      }
    }
    return insertFormula(desc, formula);
  },
  2: function () {
    // this.target_type === 3;
    let desc = '';
    if (this.action_value_2 !== 0) {
      desc += this.action_value_2 + '速度で';
    }
    desc += `${this.target_count + this.target_number}番目に${this.target_type === 4 ? '遠い' : '近い'}敵の目の前`;
    if (this.target_type === 16) { // タマキ UB
      desc = '魔法攻撃力が最も高い敵の目の前';
    }
    if (this.action_value_1 !== 0) {
      desc += this.action_value_1 + '距離';
    }
    const arr = [100500101/*マツリ UB*/, 105200202/*リマ Main1*/, 105201202/*リマ Main1+*/, 114700202/*ムイミ（ニューイヤー） Main1*/];
    if (arr.indexOf(this.action_id) < 0) {
      desc += 'に移動し、スキル終了あと元の位置に戻る。';
    } else {
      desc += 'に移動する。';
    }
    return desc;
  },
  // knockback
  3: function () {
    let target = '';
    if (this.target_range > 0 && this.target_range < 2160/* && this.target_count > 1*/) {
      target = this.target_range + '範囲内';
      if (this.target_count === 1) {
        if (this.target_type === 4)
          target += '一番遠くの敵';
        else // this.target_type === 3
          target += '一番近くの敵';
      } else {
        target += 'の敵';
      }
    } else {
      target = '敵単体';
    }
    let desc = target + 'を' + Math.abs(this.action_value_1);
    if (this.action_detail_1 === 3) {
      if (this.action_value_1 > 0)
        desc += '距離吹き飛ばす。'; // '距離ノックバックする。';
      else
        desc += '距離引き寄せる。';
    } else { // this.action_detail_1 === 3
      desc += '高度吹き飛ばす。'; // '高度ノックアップする。';
    }
    return desc;
  },
  // heal
  4: function (skillLevel, property) {
    const formula = getFormula(this.action_value_2, this.action_value_3, skillLevel, this.action_value_4, this.action_detail_1, property);
    let desc = this.description;
    if (desc === '') { // シズル（バレンタイン）
      let target = '';
      if (this.target_type === 7) {
        target = '自分';
      } else if (this.target_range === 2160 && this.target_count === 99) {
        target = '味方全体';
      } else if (this.target_range > 0/* && this.target_range < 2160*/ && this.target_count > 1) {
        target = this.target_range + '範囲内の味方';
      } else {
        target = '味方単体';
      }
      desc = target + 'のＨＰを{0}回復';
    } else {
      if (this.target_range > 0 && this.target_range < 2160/* && this.target_count > 1*/) {
        if (this.target_type === 5) // シズル（バレンタイン）
          desc = this.target_range + '範囲内最もＨＰが低い味方のＨＰを{0}回復';
        else
          desc = desc.replace('範囲内', this.target_range + '範囲内');
      }
    }
    return insertFormula(desc, formula);
  },
  // barrier
  6: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel);
    let target = '';
    if (this.target_type === 7) {
      target = '自分に';
    } else if (this.target_range === 2160 && this.target_count === 99) {
      // ミサト（サマー） UB
      if (this.target_type === 20)
        target = '物理攻撃を行うすべての味方に';
      else if (this.target_type === 21)
        target = '魔法攻撃を行うすべての味方に';
      else
        target = '味方全体に';
    } else if (this.target_range > 0/* && this.target_range < 2160*/ && this.target_count > 1) {
      target = this.target_range + '範囲内の味方に';
    } else {
      target = '味方単体に';
    }
    return insertFormula(target + this.description, formula, getEffectTime(this.action_value_3));
  },
  7: function () {
    let target = '';
    if (this.action_value_1 > 0) { // マツリ UB、ミツキ Main2
      target = '自分の前' + this.action_value_1 + '距離の位置';
    } else {
      if (this.target_type === 5) {
        target = `最もＨＰが低い${this.target_assignment === 1 ? '敵' : '味方'}`;
      } else if (this.target_type === 7) {
        target = '自分';
      } else {
        target = this.target_count + this.target_number + '番目';
        if (this.target_assignment === 1) {
          target += `に${this.target_type === 4 ? '遠い' : '近い'}敵`;
        } else { /*this.target_assignment === 2*/
          target += '前の味方';
        }
      }
    }
    return target + 'を範囲の中心にする。';
  },
  // フィールド buff debuff
  8: function () {
    let desc = this.description;
    let remarks = '';
    const akinesia = '一定時間行動不能';
    switch (this.action_detail_1) {
      case 1: // カスミ UB
        const str = `${this.action_value_1}倍にする`;
        if (desc.indexOf('一定時間低下させる') > -1) {
          desc = desc.replace('一定時間低下させる', str);
        } else {
          desc = desc.replace('ダウン', 'を' + str);
        }
        break;
      case 2:
        if (desc.indexOf(/*行動速度*/'アップ') > -1) { // ユイ UB+、アン Main2
          desc = desc.replace(/*行動速度*/'アップ', /*行動速度*/`を${this.action_value_1}倍にする`);
        } else if (desc.indexOf(/*行動速度を*/'一定時間上昇させる') > -1) { // トモ（マジカル）
          desc = desc.replace(/*行動速度を*/'一定時間上昇させる', /*行動速度を*/`${this.action_value_1}倍にする`);
          if (desc.indexOf('自身') > -1) {
            desc = desc.replace('自身', '自分');
          }
        }
        break;
      case 3: // アオイ Main2
        desc = desc.replace(akinesia, '麻痺状態');
        break;
      case 4: // レム Main1
        desc = desc.replace(akinesia, '凍結状態');
        break;
      case 5: // カスミ Main1
        desc = desc.replace(akinesia, '束縛状態');
        break;
      case 6: // ハツネ（サマー） UB
        desc = desc.replace('行動不能', '睡眠状態');
        remarks = '攻撃を受けたときにのみ解除される。';
        break;
      case 7: // マツリ Main1
        desc = desc.replace(akinesia, 'スタン状態');
        break;
      case 11: // アユミ（ワンダー） Main2
        desc = desc.replace(akinesia, '時停状態');
        break;
    }
    return desc.replace('範囲内', this.target_range + '範囲内') + getEffectTime(this.action_value_3) + remarks;
  },
  9: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel);
    let target = '敵単体';
    if (this.target_range > 0 && this.target_range < 2160/* && this.target_count > 1*/) {
      target = this.target_range + '範囲内の敵';
    }
    let state = '';
    if (this.action_detail_1 === 1) state = '毒';
    else if (this.action_detail_1 === 2) state = '火傷';
    else if (this.action_detail_1 === 3) state = '呪い';
    else if (this.action_detail_1 === 4) state = '猛毒';
    else state = '???';
    let desc = `${target}を${state}状態にし、毎秒{0}${state}ダメージを与える`; //this.description.replace('{0}', `${target}を${state}状態にし、毎秒{0}`);
    return insertFormula(desc, formula, getEffectTime(this.action_value_3));
  },
  // buff debuff
  10: function (skillLevel, property, actionList) {
    let formula: [number | string, string?];
    if (this.action_value_1 === 1)
      formula = getFormula(this.action_value_2, this.action_value_3, skillLevel);
    else // this.action_value_1 === 2
      formula = [this.action_value_2 + '%'];
    let desc = this.description;
    if (this.action_id === 109101207) { // シズル（バレンタイン）
      desc = desc.replace('対象の味方', '味方全体');
    } else {
      if (desc === '') {
        desc = getSameDesc(this, actionList);
        if (desc === '') { // コッコロ（プリンセス）
          const prevAction = actionList.find(item => item.action_id === this.action_id - 1);
          if (prevAction)
            desc = prevAction.description;
        }
      }
      // コッコロ（プリンセス）
      if ((this.action_detail_1 === 21 || this.action_detail_1 === 110) && desc.indexOf('・魔法') > -1) {
        desc = desc.replace('・魔法', '');
      } else if ((this.action_detail_1 === 41 || this.action_detail_1 === 120) && desc.indexOf('物理・') > -1) {
        desc = desc.replace('物理・', '');
      }
      if (this.action_detail_1 === 101) { // ツムギ Main2
        desc = desc.replace('一定時間低下させる', '{0}ダウン');
      }
      if (this.target_range > 0 && this.target_range < 2160/* && this.target_count > 1*/) {
        desc = desc.replace('範囲内', this.target_range + '範囲内');
      }
    }
    return insertFormula(desc, formula, getEffectTime(this.action_value_4));
  },
  // 誘惑、混乱
  11: function () {
    let desc = this.description;
    if (this.target_range > 0 && this.target_range < 2160/* && this.target_count > 1*/) {
      desc = desc.replace('範囲内', this.target_range + '範囲内');
    }
    if (this.action_detail_1 === 1) {
      let odds = this.action_value_3; // アユミ UB
      if (odds <= 1) odds = odds * 100; // カスミ Main2
      desc = desc.replace('混乱させる', getOdds(odds) + '混乱状態にする');
    } else {
      // ユキ Main+、イオ UB
      desc = desc.replace('誘惑する', getOdds(this.action_value_3) + '誘惑状態にする');
    }
    return desc + getEffectTime(this.action_value_1);
  },
  // 暗闇
  12: function () {
    let desc = this.description;
    if (this.target_range > 0 && this.target_range < 2160/* && this.target_count > 1*/) {
      desc = desc.replace('範囲内', this.target_range + '範囲内');
    }
    desc = desc.replace('暗闇', getOdds(this.action_value_3) + '暗闇');
    return desc + getEffectTime(this.action_value_1);
    // const actionObj = getActionObj(getActionNum(this.action_id) - 1);
    // return [
    //   actionObj,
    //   `にダメージを与えられたターゲットを${getOdds(this.action_value_3)}${this.description + getEffectTime(this.action_value_1)}` +
    //   `物理攻撃は${getOdds(100 - this.action_detail_1)}ミスする。`
    // ];
  },
  // ムイミ UB
  14: function () {
    const pattern = this.action_detail_2 % 10;
    let desc = '';
    if (pattern === 1) {
      desc = 'ＴＰが無くなると、';
    } else {
      desc = `ＴＰを毎秒${this.action_value_1}消耗し、ＴＰが無くなるまでの間天楼覇断剣を装備し、`;
    }
    desc += `行動パターンを${pattern}に変化させる。`;
    return desc;
  },
  // 召喚物 summoned
  15: function () {
    let target = '';
    // シノブ Main1、ネネカ UB、スズメ（サマー） Main1
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
    let desc = this.description;
    if (desc === '') { // シズル（バレンタイン）
      let target = '';
      if (this.target_type === 7) {
        target = '自分';
      } else if (this.target_range === 2160 && this.target_count === 99) {
        target = '味方全体';
      } else if (this.target_range > 0/* && this.target_range < 2160*/ && this.target_count > 1) {
        target = this.target_range + '範囲内の味方';
      } else {
        target = '味方単体';
      }
      desc = target + 'のＴＰを{0}回復';
    } else {
      if (this.target_range > 0 && this.target_range < 2160/* && this.target_count > 1*/) {
        if (this.target_type === 5) // シズル（バレンタイン）
          desc = this.target_range + '範囲内最もＨＰが低い味方のＴＰを{0}回復';
        else
          desc = desc.replace('範囲内', this.target_range + '範囲内');
      }
    }
    return insertFormula(desc, formula);
  },
  // アンナ Main2 action1
  17: function () {
    return '自分のＨＰが最大ＨＰの' + this.action_value_3 + '%以下になった時に発動する。';
  },
  // レイ　構え中に受けたダメージ
  18: function () {
    const formula = this.action_value_1 + '×受けたダメージ';
    const actionNum = getActionNum(this.action_detail_2);
    return [`攻撃前の${this.action_value_3}秒構え中に受けたダメージに応じて、`, getActionObj(actionNum), '与えるダメージが', getFormulaObj(formula), 'アップする。'];
  },
  // 挑発
  20: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, undefined, undefined, undefined, v => v);
    let target = '';
    if (this.target_type === 7)
      target = '自分';
    else // this.target_type === 35 背後にいないキャラの内、最も残りＨＰの値が多い味方１キャラ
      target = '対象の味方'; // ヨリ（エンジェル）
    const desc = target + 'を挑発状態にする、効果時間{0}秒';
    return insertFormula(desc, formula);
  },
  // ミヤコ　無敵状態
  21: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, undefined, undefined, undefined, v => v);
    let state = '';
    if (this.action_detail_1 === 1) state = '無敵';
    else if (this.action_detail_1 === 2) state = '物理無効';
    return insertFormula(`自分を${state}状態にする、効果時間{0}秒`, formula);
  },
  // ラビリスタ UB
  22: function () {
    const pattern = this.action_detail_2 % 10;
    let desc = '七冠の権能を解放し、';
    if (pattern === 1) {
      desc = 'オブジェクトクリエイションを解除し、'
    }
    desc += `行動パターンを${pattern}に変化させる。`;
    return desc;
  },
  23: function () {
    const detail1 = this.action_detail_1;
    let actionA = getActionObj(getActionNum(this.action_detail_2));
    let actionB = getActionObj(getActionNum(this.action_detail_3));
    let target = '対象の';
    if (this.target_range > 0 && this.target_range < 2160/* && this.target_count > 1*/) {
      target = this.target_range + '範囲内の';
    }
    target = target + (this.target_assignment === 1 ? '敵' : '味方');
    let condition = '';
    if (detail1 === 100) { // レム UB
      condition = '行動不能状態'
    } else if (detail1 === 300) { // イオ Main1+ action_detail_1: 300, action_value_1: 0, action_value_2: 1
      condition = '誘惑状態';
    } else if (detail1 === 502) { // アオイ Main1+ action_detail_1: 502, action_value_1: 1, action_value_2: 2
      condition = '毒状態';
      [actionA, actionB] = [actionB, actionA];
    } else if (detail1 === 512) { // アオイ（編入生） Main1
      condition = '毒か猛毒';
    } else if (detail1 === 700) { // マコト（サマー） UB Main1
      condition = '残りの攻撃対象が1つの場合';
      if (this.action_detail_3 !== 0)
        return [condition, actionA, 'を使う、でないと', actionB, 'を使う。'];
      else
        return [condition, actionA, 'を使う。'];
    } else if (detail1 === 1300) { // タマキ UB+ action_detail_1: 1300, action_value_1: 0, action_value_2: 0
      condition = '魔法攻撃をする敵';
      [actionA, actionB] = [actionB, actionA];
    } else if (detail1 > 900 && detail1 < 1000) { // レイ（ハロウィン） UB
      const persent = detail1.toString().substr(1);
      let target = this.target_assignment === 1 ? '敵' : '味方';
      let desc = '';
      if (this.target_type === 7) {
        desc = '自分';
      } else if (this.target_range > 0 && this.target_range < 2160/* && this.target_count > 1*/) {
        desc = `${this.target_range}範囲内の${target}`;
      } else {
        desc = '対象';
      }
      desc += `の残りＨＰが最大ＨＰの${persent}%未満だった場合`
      if (this.action_detail_3 === 0)
        return [desc, actionA, 'を使う。'];
      return [desc, actionA, 'を使う、でないと', actionB, 'を使う。'];
    } else if (detail1 > 600 && detail1 < 700) {
      const stateID = getState(detail1);
      const stateObj = getStateObj(stateID);
      if (stateID === 50) { // アン 英霊の加護
        return [stateObj, 'を受けているキャラが', actionA, 'の対象になる。'];
      } else if (stateID === 60) { // ルナ
        return [stateObj, `が${this.action_value_3}人以上の場合`, actionA, 'を使う。'];
      } else if (stateID === 61) { // クリスティーナ（クリスマス）
        return [stateObj, 'を持っている場合', actionA, 'を使う、でないと', actionB, 'を使う。'];
      }
    }
    return [target + 'が', condition + 'だった場合', actionA, 'を使う、でないと', actionB, 'を使う。'];
  },
  26: function (skillLevel, property, actionList) {
    const actionNum = getActionNum(this.action_detail_1);
    const targetAction = actionList.find(item => item.action_id === this.action_detail_1)!;
    const [effect, formula] = getEffectModified(this, targetAction);
    return [getActionObj(actionNum), `の${effect}を`, getFormulaObj(formula), 'アップする。'];
  },
  27: function (skillLevel, property, actionList) {
    const actionNum = getActionNum(this.action_detail_1);
    const targetAction = actionList.find(item => item.action_id === this.action_detail_1)!;
    const [effect, formula] = getEffectModified(this, targetAction);
    return [getActionObj(actionNum), `の${effect}を`, getFormulaObj(formula), 'で乗じる。'];
  },
  28: function () {
    const actionA = getActionObj(getActionNum(this.action_detail_2));
    const actionB = getActionObj(getActionNum(this.action_detail_3));
    if (this.action_detail_1 > 1200) {
      // アリサ UB          (ub)     detail_1: 1211, value_1: 1, value_2: 2
      // アリサ Main2       (ub)     detail_1: 1211, value_1: 1, value_2: 2
      // カヤ UB            (ub)     detail_1: 1211, value_1: 1, value_2: 2
      // カヤ Main1+        (skill1) detail_1: 1221, value_1: 1, value_2: 2
      // スズナ（サマー） UB (skill2) detail_1: 1211, value_1: 1, value_2: 2
      // ルカ（サマー） UB   (ub)     detail_1: 1211, value_1: 0, value_2: 0
      const counter = 'カウンター' + this.action_detail_1.toString().substr(-2, 1);
      const count = this.action_value_1;
      if (this.action_detail_2 === 0) {
        return [counter + `の数が${count > 0 ? count + '以下' : count}の場合`, actionB, 'を使う。'];
      }
      if (this.action_detail_3 === 0) {
        return [counter + `の数が${count}以上の場合`, actionA, 'を使う。'];
      }
      return [counter + `の数が${count}以上の場合`, actionA, 'を使う、でないと', actionB, 'を使う。'];
    } else if (this.action_detail_1 === 700) { // マコト（サマー） Main1+ Main2
      const condition = '残りの攻撃対象が1つの場合';
      if (this.action_detail_3 !== 0)
        return [condition, actionA, 'を使う、でないと', actionB, 'を使う。'];
      else
        return [condition, actionA, 'を使う。'];
    } else if (this.action_detail_1 === 1000) {
      // エリコ UB
      return ['敵を倒した場合', actionA, 'を使う。'];
    } else if (this.action_detail_1 > 900) {
      // ぺコリーヌ（ニューイヤー） UB
      const percent = this.action_detail_1.toString().substr(-2);
      if (this.action_detail_2 === 0) {
        return [`自分の残りＨＰが${percent}％以上だった場合`, actionB, 'を使う。'];
      }
      return [`自分の残りＨＰが${percent}％以上だった場合`, actionB, 'を使う、でないと', actionA, 'を使う。'];
    } else if (this.action_detail_1 > 600) {
      const stateID = getState(this.action_detail_1);
      const stateObj = getStateObj(stateID);
      if (stateID === 50) { // アン 英霊の加護
        return ['自分が', stateObj, 'を受けている場合', actionA, 'を使う、でないと', actionB, 'を使う。']
      } else if (stateID === 60) { // ルナ おともだち
        return [stateObj, `の数が${this.action_value_3}以上の場合`, actionA, 'を使う、でないと', actionB, 'を使う。'];
      } else if (stateID === 61) { // クリスティーナ（クリスマス）
        if (this.action_detail_3 === 0) {
          return [stateObj, 'を持っている場合', actionA, 'を使う。'];
        }
        return [stateObj, 'を持っている場合', actionA, 'を使う、でないと', actionB, 'を使う。'];
      } else if (stateID === 77) { // レイ 風の刃
        return ['自分が', stateObj, 'を纏っていた場合', actionB, 'を使う、でないと', actionA, 'を使う。'];
      }
    } else if (this.action_detail_1 === 100) {
      // ミフユ UB+
      return ['対象の敵が既に行動不能状態だった場合', actionA, 'を使う。'];
    } else { // this.action_detail_1 < 100
      // スズメ UB action_detail_1: 33
      return [getOdds(this.action_detail_1), actionA, 'を使う、' + getOdds(100 - this.action_detail_1), actionB, 'を使う。'];
    }
    return this.description;
  },
  // アンナ Main2 action3
  30: function () {
    return '自分を戦闘不能状態にする。';
  },
  // アカリ UB ＨＰ吸収付与
  32: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel);
    return ['味方全体の次の攻撃に' + formula[0], getFormulaObj(formula[1]!), 'ＨＰ吸収効果を付与する。'];
  },
  33: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel);
    let desc = '攻撃してきた敵に{0}ダメージを与えて消失する';
    if (this.action_detail_2 === 2) { //ルゥ Main1
      desc += `オメメちゃんを${this.action_value_3}体呼び出す。最大${this.action_detail_1}体まで呼び出される`;
    } else if (this.action_detail_2 === 4) { // `サレン（クリスマス） UB
      desc += `光の盾を${this.action_value_3}つ付与する。最大${this.action_detail_1}つまで付与される`;
    } else {
      desc = this.description;
    }
    return insertFormula(desc, formula);
  },
  // カオリ Main2
  34: function (skillLevel) {
    const formula = getFormula(this.action_value_2, this.action_value_3, skillLevel);
    return insertFormula(this.description, formula, '、効果は最大' + this.action_value_4 + '回まで累積する。');
  },
  35: function () {
    const stateID = this.action_value_2;
    const stateObj = getStateObj(stateID);
    if (stateID === 50) { // アン
      return [this.target_range + '範囲内の味方に', stateObj, 'を付与する' + getEffectTime(this.action_value_3)];
    } else if (stateID === 60) { //　ルナ
      if (this.action_value_4 > 0) {
        return [stateObj, `を追加で${this.action_value_4}人増やす。`];
      } else {
        const count = -this.action_value_4;
        if (this.action_value_4 <= -5) {
          return [stateObj, `を最大${count}人減らす。`];
        } else {
          return [stateObj, `が${count}人以上いる時`, stateObj, `を${count}人減らす。`];
        }
      }
    } else if (stateID === 61) { // クリスティーナ（クリスマス）
      if (this.action_value_4 > 0)
        return [stateObj, 'を持っていない場合、', stateObj, 'を獲得する。'];
      else
        return [stateObj, 'を持っている場合、', stateObj, 'を消耗する。'];
    } else if (stateID === 77) { // レイ UB+
      return [stateObj, 'を纏う。纏っている間、スキルの効果値が２倍になる' + getEffectTime(this.action_value_3)];
    } else if (stateID === 90) { // マツリ（ハロウィン） UB
      return [`UBの使用回数を${this.action_value_4}回増やす。最大${this.action_value_1}回まで増やせる。`];
    }
    return this.description;
  },
  // アキノ UB+、グレア Main2
  36: function (skillLevel, property) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, this.action_value_3, this.action_detail_1, property);
    let target = '';
    if (this.target_type === 7) {
      target = '自分に';
    } else if (this.target_assignment === 2) {
      target = '味方に';
    } else { // this.target_assignment === 1
      if (this.target_type === 14)
        target = '最も物理攻撃力が高い敵に';
      else
        target = '敵単体に';
    }
    let desc = this.description.replace('毎秒', `${target}半径${this.action_value_7}毎秒`);
    return insertFormula(desc, formula, getEffectTime(this.action_value_5));
  },
  // アキノ Main2、ミフユ Main1+
  37: function (skillLevel, property) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, this.action_value_3, this.action_detail_1, property);
    let target = '';
    if (this.target_type === 7) {
      target = '自分に';
    } else if (this.target_assignment === 2) {
      target = '味方に';
    } else { // this.target_assignment === 1
      target = '敵単体に';
    }
    let desc = target + '半径' + this.action_value_7 + this.description;
    return insertFormula(desc, formula, getEffectTime(this.action_value_5));
  },
  38: function (skillLevel) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel);
    let target = ''; // target_type: 11 ミツキ Main2
    if (this.target_type === 7) { // ネネカ UB、ラビリスタ UB
      target = '自分に';
    } else if (this.target_type === 3 || this.target_type === 10) { // カスミ UB、スズメ（サマー） Main1+、アオイ（編入生） Main1+
      target = this.target_count + this.target_number + '番目';
      if (this.target_assignment === 1) {
        target += 'に近い敵に';
      } else { /*this.target_assignment === 2*/
        target += '前の味方に';
      }
    }
    const desc = `${target}半径${this.action_value_5}のフィールドを展開し、${this.description.replace('フィールドを展開する', '')}`;
    return insertFormula(desc, formula, getEffectTime(this.action_value_3));
  },
  // アキノ Main1
  42: function () {
    const actionNum = getActionNum(this.action_detail_2);
    return [`${this.action_value_4}秒内ダメージを受けた場合、${getOdds(this.action_value_1)}`, getActionObj(actionNum), 'を使う。'];
  },
  // リマ Main1
  44: function () {
    return 'バトル' + this.action_value_1 + '秒後入場する。';
  },
  // アリサ UB、カヤ UB Main1+、スズナ（サマー）
  45: function () {
    return `カウンター${this.action_detail_1}の数を${this.action_value_1}増やせる。`;
  },
  // イリヤ（クリスマス） Main2
  46: function () {
    // return this.description + '。';
    return `自分の残りＨＰの${this.action_value_1}%を消費する。`;
  },
  // ＨＰ/ＴＰ継続回復状態付与
  48: function (skillLevel, property) {
    const formula = getFormula(this.action_value_1, this.action_value_2, skillLevel, this.action_value_3, this.action_detail_1, property);
    let target = '';
    if (this.target_type === 7) {
      target = '自分';
    } else if (this.target_range === 2160 && this.target_count === 99) {
      target = '味方全体';
    } else if (this.target_range > 0/* && this.target_range < 2160*/ && this.target_count > 1) {
      target = this.target_range + '範囲内の味方';
    } else {
      target = '味方単体';
    }
    let desc = this.description;
    if (this.action_detail_1 === 1 && this.action_detail_2 === 2) {
      desc = desc.replace('毎秒ＴＰを', 'のＴＰを毎秒')
    } else { // this.action_detail_1 === 2 && this.action_detail_2 === 1
      desc = desc.replace('毎秒ＨＰを', 'のＨＰを毎秒')
    }
    return insertFormula(target + desc, formula, getEffectTime(this.action_value_5));
  },
  // クルミ（クリスマス） Main1
  50: function (skillLevel) {
    const formula = getFormula(this.action_value_2, this.action_value_3, skillLevel);
    let desc = this.description;
    if (this.target_range > 0 && this.target_range < 2160/* && this.target_count > 1*/) {
      desc = desc.replace('範囲内', this.target_range + '範囲内');
    }
    desc = `持続${this.action_value_4}秒` + desc.replace('している間、', 'して、この間');
    return insertFormula(desc, formula, `、だが${this.action_detail_3}回攻撃を受けるとアクションが中断される。`);
  },
  // シズル（バレンタイン） Main1
  53: function () {
    const skill = getSkillNickname(this.action_detail_1);
    const actionObj = getActionObj(getActionNum(this.action_detail_1));
    const actionA = getActionObj(getActionNum(this.action_detail_2));
    const actionB = getActionObj(getActionNum(this.action_detail_3));
    return [skill + 'の', actionObj, 'のフィールドが展開中の場合', actionA, 'を使う、でないと', actionB, 'を使う。'];
  },
  // ラム Main2
  56: function () {
    return this.description + '。';
  },
  // ミソギ（ハロウィン）
  57: function () {
    const action = getActionObj(getActionNum(this.action_detail_1));
    return [`前方の敵すべてに爆弾を設置し、${this.action_value_1}秒後に起爆する。爆弾はそれぞれ、起爆時に`, action, 'を発動させる。'];
  },
  // ラビリスタ SP3
  58: function () {
    const skill = getSkillNickname(this.action_detail_1);
    const actionObj = getActionObj(getActionNum(this.action_detail_1));
    return [`七冠の権能を解除し、${skill}の`, actionObj, 'のスキル効果を失わせる。'];
  },
  60: function () {
    const stateID = this.action_value_2;
    const stateObj = getStateObj(stateID);
    if (stateID === 57) { // クロエ Main1
      return ['敵に攻撃が当たるたびに、対象の', stateObj, 'の数を1増やせるようになる。敵一人当たり',
        stateObj, `の数は最大${this.action_value_1}まで追加される` + getEffectTime(this.action_value_3)];
    } else if (stateID === 60) { // ルナ SP1
      return ['行動するたびに', stateObj, 'の数を1増やせるようになる。',
        stateObj, `の数は最大${this.action_value_1}まで追加される` + getEffectTime(this.action_value_3)];
    } else if (stateID === 76) {
      return ['敵にクリティカルでダメージを与えるたびに', stateObj, 'の数を1増やせるようになる。敵一人当たり',
        stateObj, `の数は最大${this.action_value_1}まで追加される` + getEffectTime(this.action_value_3)];
    }
    return this.description;
  },
  // 恐慌
  61: function () {
    return getOdds(this.action_value_3) + this.description + getEffectTime(this.action_value_1);
  },
  // ぺコリーヌ（プリンセス）
  71: function (skillLevel) {
    const formula = getFormula(this.action_value_2, this.action_value_3, skillLevel);
    return insertFormula('自分に騎士の加護を付与する' + getEffectTime(this.action_value_6) + this.description, formula);
  },
  // ルカ（サマー） UB
  75: function () {
    const actionObj = getActionObj(getActionNum(this.action_detail_2));
    return [actionObj, `が${this.action_value_1}回ダメージを与えるたびに発動するようになる。`];
  },
  77: function () {
    const stateID = this.action_value_2;
    const stateObj = getStateObj(stateID);
    if(stateID === 92) { // アキノ（クリスマス） Main1
      return ['ステータスアップ効果を受けるたびに、自分に', stateObj, 'の数を1増やせるようになる。', stateObj, `の数は最大${this.action_value_1}まで追加される` + getEffectTime(this.action_value_3)];
    }
    return this.description;
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
  return {
    ...skillAction,
    getDescData,
  };
}
