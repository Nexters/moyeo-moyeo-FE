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

export type Room = {
  roomUrl: string;
  roundStatus: Round;
};

export type Team = {
  uuid: string;
  teamName: string;
  pmPosition: Position;
  selectDone: boolean;
};

export type User = {
  uuid: string;
  userName: string;
  position: Position;
  choices: string[];
  joinedTeamId: string;
  selectedTeam: boolean;
};

export type TotalInfo = {
  roomInfo: Room;
  teamInfoList: Team[];
  userInfoList: User[];
};