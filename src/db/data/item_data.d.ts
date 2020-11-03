export interface ItemData {
  item_id: number;
  item_name: string;
  description: string;
  promotion_level: number;
  item_type: number;
  value: number;
  price: number;
  limit_num: number;
  gojuon_order: number;
  sell_check_disp: number;
  start_time: string;
  end_time: string;
}

declare const data: ItemData[];
export default data;
