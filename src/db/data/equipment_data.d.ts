export interface EquipmentData {
  equipment_id: number;
  equipment_name: string;
  description: string;
  promotion_level: number;
  craft_flg: number;
  equipment_enhance_point: number;
  sale_price: number;
  require_level: number;
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
  enable_donation: number;
  accuracy: number;
  display_item: number;
  item_type: number;
}

declare const data: EquipmentData[];
export default data;