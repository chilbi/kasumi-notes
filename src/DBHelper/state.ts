export interface StateData {
  name: string;
  effect: string;
}

export const state: Record<number, StateData> = {
  50: {
    name: '英霊の加護',
    effect: '',
  },
  77: {
    name: '風の刃',
    effect: 'スキルの効果値が2倍になる',
  },
};
