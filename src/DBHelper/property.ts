import Big from 'big.js';

export type PropertyKeys =
  | 'hp'
  | 'atk'
  | 'def'
  | 'magic_str'
  | 'magic_def'
  | 'physical_critical'
  | 'magic_critical'
  | 'dodge'
  | 'life_steal'
  | 'wave_hp_recovery'
  | 'wave_energy_recovery'
  | 'physical_penetrate'
  | 'magic_penetrate'
  | 'energy_recovery_rate'
  | 'hp_recovery_rate'
  | 'energy_reduce_rate'
  | 'accuracy';

export type Property<T extends number | Big = number | Big> = Record<PropertyKeys, T>;

export const propertyKeys: PropertyKeys[] = [
  'hp', // 1
  'atk', // 2
  'def', // 3
  'magic_str', // 4
  'magic_def', // 5
  'physical_critical', // 6
  'magic_critical', // 7
  'dodge', // 8
  'life_steal', // 9
  'wave_hp_recovery', // 10
  'wave_energy_recovery', // 11
  'physical_penetrate', // 12(未知)
  'magic_penetrate', // 13(未知)
  'energy_recovery_rate', // 14
  'hp_recovery_rate', // 15
  'energy_reduce_rate', // 16(未知)
  'accuracy', // 17
];

export function plus(
  properties: (Property | Partial<Property> | undefined)[],
  valueCallback = (v: Big) => v
): Property<Big> {
  return propertyKeys.reduce((result, key) => {
    const value = properties.reduce(
      (value, property) => value.plus(property && property[key] ? property[key]! : 0),
      Big(0)
    );
    result[key] = valueCallback(value);
    return result;
  }, {} as Property<Big>);
}

export function plusMultiply(
  plusProperty: Property,
  multiplyProperty: Property,
  multiplier: number,
  valueCallback = (v: Big) => v,
  multiplyCallback = (v: Big) => v,
  multiplyKeySuffix = ''
): Property<Big> {
  return propertyKeys.reduce((result, key) => {
    const multiplyValue = multiplyCallback(Big(multiplyProperty[key + multiplyKeySuffix as keyof Property]).times(multiplier));
    const value = multiplyValue.plus(plusProperty[key])
    result[key] = valueCallback(value);
    return result;
  }, {} as Property<Big>);
}
