import { Round } from '@/types';

export const MAX_ROUND = 4;

export const ROUNDS: Round[] = [
  '1지망',
  '2지망',
  '3지망',
  '4지망',
  '자유',
  '종료',
];

export const ROUND_INDEX_MAP: Record<string, number> = {
  '1지망': 0,
  '2지망': 1,
  '3지망': 2,
  '4지망': 3,
};

export const NEXT_ROUND_MAP: Record<Round, Round> = {
  '1지망': '2지망',
  '2지망': '3지망',
  '3지망': '4지망',
  '4지망': '자유',
  자유: '종료',
  종료: '종료',
};

export const POSITION: Record<string, string> = {
  frontend: '프론트엔드',
  backend: '백엔드',
  ios: 'iOS',
  android: '안드로이드',
  design: '디자인',
};
export const POSITION_LIST = Object.entries(POSITION).map(([key, value]) => ({
  label: value,
  value: key,
}));

// max length
export const MAX_LENGTH__USER_NAME = 50;
