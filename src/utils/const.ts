import { Position, Round } from '@/types';

export const MAX_ROUND = 4;

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

export const ROUND_INDEX_MAP: Record<Round, number> = {
  FIRST_ROUND: 0,
  SECOND_ROUND: 1,
  THIRD_ROUND: 2,
  FOURTH_ROUND: 3,
  ADJUSTED_ROUND: 4,
  COMPLETE: 5, // @note: 해당 값으로 넘어가면 stepper는 선택된게 없다.
};

export const ROUND_LABEL_MAP: Record<Round, string> = {
  FIRST_ROUND: '1지망',
  SECOND_ROUND: '2지망',
  THIRD_ROUND: '3지망',
  FOURTH_ROUND: '4지망',
  ADJUSTED_ROUND: '팀 구성 조정',
  COMPLETE: '팀 빌딩 완료',
};

// max length
export const MAX_LENGTH__USER_NAME = 5;
export const MAX_LENGTH__USER_PROFILE = 255;

export const MAX_LENGTH__TEAM_BUILDING_NAME = 20;
export const MAX_LENGTH__TEAM_NAME = 50;
