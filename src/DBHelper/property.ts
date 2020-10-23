import Big from 'big.js';

export interface Property {
  hp: number; // 1
  atk: number; // 2
  def: number; // 3
  magic_str: number; // 4
  magic_def: number; // 5
  physical_critical: number; // 6
  magic_critical: number; // 7
  dodge: number; // 8
  life_steal: number; // 9
  wave_hp_recovery: number; // 10
  wave_energy_recovery: number; // 11
  physical_penetrate: number; // 12?
  magic_penetrate: number; // 13?
  energy_recovery_rate: number; // 14
  hp_recovery_rate: number; // 15
  energy_reduce_rate: number; // 16?
  accuracy: number; // 17
}

export const propertyKeys = [
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
] as const;

export function plus(
  properties: (Property | Partial<Property> | undefined)[],
  valueCallback = (v: Big) => v
): Property {
  return propertyKeys.reduce((result, key) => {
    const value = properties.reduce(
      (value, property) => value.plus(property && property[key] ? property[key]! : 0),
      Big(0)
    );
    result[key] = valueCallback(value).toNumber();
    return result;
  }, {} as Property);
}

export function plusMultiply(
  plusProperty: Property,
  multiplyProperty: Property,
  multiplier: number,
  valueCallback = (v: Big) => v,
  multiplyCallback = (v: Big) => v,
  multiplyKeySuffix = ''
) {
  return propertyKeys.reduce((result, key) => {
    const multiplyValue = multiplyCallback(Big(multiplyProperty[key + multiplyKeySuffix as keyof Property]).times(multiplier));
    const value = multiplyValue.plus(plusProperty[key])
    result[key] = valueCallback(value).toNumber();
    return result;
  }, {} as Property);
}
