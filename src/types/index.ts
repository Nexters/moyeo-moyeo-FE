export type Round =
  | 'FIRST_ROUND'
  | 'SECOND_ROUND'
  | 'THIRD_ROUND'
  | 'FOURTH_ROUND'
  | 'ADJUSTED_ROUND'
  | 'COMPLETE';

export type Position =
  | 'DESIGNER'
  | 'BACK_END'
  | 'FRONT_END'
  | 'IOS'
  | 'ANDROID';

export type TeamBuilding = {
  teamBuildingUrl: string;
  teamBuildingName: string;
  teamBuildingStatus: Round;
};

export type Team = {
  uuid: string;
  teamName: string;
  pmName: string;
  pmPosition: Position;
  selectDone: boolean;
};

export type User = {
  uuid: string;
  userName: string;
  position: Position;
  choices: Team['uuid'][];
  joinedTeamUuid: string;
  profileLink: string;
  selectedTeam: boolean;
};

export type TotalInfo = {
  teamBuildingInfo: TeamBuilding;
  teamInfoList: Team[];
  userInfoList: User[];
};

export type Choice = '1지망' | '2지망' | '3지망' | '4지망' | '팀 구성 조정';
