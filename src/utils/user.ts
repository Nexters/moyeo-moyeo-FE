import { Position } from '@/types';

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const POSITION_INDEX: Record<Position, number> = {
  DESIGNER: 1,
  FRONT_END: 2,
  BACK_END: 3,
  IOS: 4,
  ANDROID: 5,
};
export const comparePosition = (posA: Position, posB: Position) => {
  return (POSITION_INDEX[posA] ?? 0) - (POSITION_INDEX[posB] ?? 0);
};
