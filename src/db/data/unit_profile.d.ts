export interface UnitProfile {
  unit_id: number;
  unit_name: string;
  age: string;
  guild: string;
  race: string;
  height: string;
  weight: string;
  birth_month: string;
  birth_day: string;
  blood_type: string;
  favorite: string;
  voice: string;
  voice_id: number;
  catch_copy: string;
  self_text: string;
  guild_id: string;
}

declare const data: UnitProfile[];
export default data;
