import React from 'react';
import Infobar from './Infobar';
import { Property, PropertyKeys } from '../DBHelper/property';
import Big from 'big.js';
// import { getFightingCapacity } from '../DBHelper/helper';

const allPropertyKeys: PropertyKeys[] = [
  'atk', // 2
  'magic_str', // 4
  'def', // 3
  'magic_def', // 5
  'physical_critical', // 6
  'magic_critical', // 7
  'hp', // 1
  'life_steal', // 9
  'wave_hp_recovery', // 10
  'wave_energy_recovery', // 11
  'accuracy', // 17
  'dodge', // 8
  'physical_penetrate', // 12(未知)
  'magic_penetrate', // 13(未知)
  'energy_recovery_rate', // 14
  'energy_reduce_rate', // 16(未知)
  'hp_recovery_rate', // 15
];

const keyLabel = {
  hp: 'HP',
  atk: '物理攻撃力',
  def: '物理防御力',
  magic_str: '魔法攻撃力',
  magic_def: '魔法防御力',
  physical_critical: '物理クリティカル',
  magic_critical: '魔法クリティカル',
  dodge: '回避',
  life_steal: 'HP吸収',
  wave_hp_recovery: 'HP自動回復',
  wave_energy_recovery: 'TP自動回復',
  physical_penetrate: '物理貫通',
  magic_penetrate: '魔法貫通',
  energy_recovery_rate: 'TP上昇',
  hp_recovery_rate: '回復量上昇',
  energy_reduce_rate: 'TP消費軽減',
  accuracy: '命中',
};

const keyAbbrLabel = {
  hp: 'HP',
  atk: '物攻',
  def: '物防',
  magic_str: '魔攻',
  magic_def: '魔防',
  physical_critical: '物爆',
  magic_critical: '魔爆',
  dodge: '回避',
  life_steal: 'HP吸収',
  wave_hp_recovery: 'HP自回',
  wave_energy_recovery: 'TP自回',
  physical_penetrate: '物理貫通',
  magic_penetrate: '魔法貫通',
  energy_recovery_rate: 'TP上昇',
  hp_recovery_rate: '回復上昇',
  energy_reduce_rate: 'TP軽減',
  accuracy: '命中',
};

interface CharaStatusProps {
  property?: Partial<Property<Big>>;
  partial?: boolean;
  abbr?: boolean;
  // showFightingCapacity?: boolean;
}

function CharaStatus(props: CharaStatusProps) {
  const property: Partial<Property<Big>> = props.property || {};
  const keys = props.partial ? Object.keys(props.property || {}) as PropertyKeys[] : allPropertyKeys;
  const isNullable = !props.property;
  if (isNullable) {
    for (let key of keys) {
      property[key] = '???' as any;
    }
  }
  return (
    <>
      {keys.map(key => (
        <Infobar
          key={key}
          size={props.abbr ? 'medium': 'large'}
          width={50}
          label={props.abbr ? keyAbbrLabel[key] : keyLabel[key]}
          value={isNullable ? property[key] as any as string : property[key]!.round(0, 1).toString()}
        />
      ))}
      {/* {props.showFightingCapacity && (
        <Infobar
          key="fighting_capacity"
          size="large"
          label="戦力"
          value={props.property ? getFightingCapacity(props.property as Property) : '???'}
        />
      )} */}
    </>
  );
}

export default CharaStatus;
