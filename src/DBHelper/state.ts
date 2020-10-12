export interface StateData {
  name: string;
  effect: string;
}

export const state: Record<number, StateData> = {
  77: {
    name: '風の刃',
    effect: 'スキルの効果値が2倍になる',
  },
};
