import { Position } from '@/types';
import { Round } from '@/types.old';

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

export const POSITION: Record<Position, string> = {
  DESIGNER: '디자이너',
  FRONT_END: '프론트엔드',
  BACK_END: '백엔드',
  IOS: 'iOS',
  ANDROID: '안드로이드',
};
export const POSITION_LIST = Object.entries(POSITION).map(([key, value]) => ({
  label: value,
  value: key as Position,
}));

// max length
export const MAX_LENGTH__USER_NAME = 20;
export const MAX_LENGTH__USER_PROFILE = 255;

export const MAX_LENGTH__TEAM_BUILDING_NAME = 20;
export const MAX_LENGTH__TEAM_NAME = 50;
