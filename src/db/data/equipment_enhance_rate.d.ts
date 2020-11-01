export interface EquipmentEnhanceRate {
  equipment_id: number;
  description: string;
  promotion_level: number;
  hp: number;
  atk: number;
  magic_str: number;
  def: number;
  magic_def: number;
  physical_critical: number;
  magic_critical: number;
  wave_hp_recovery: number;
  wave_energy_recovery: number;
  dodge: number;
  physical_penetrate: number;
  magic_penetrate: number;
  life_steal: number;
  hp_recovery_rate: number;
  energy_recovery_rate: number;
  energy_reduce_rate: number;
  accuracy: number;
}

declare const data: EquipmentEnhanceRate[];
export default data;
