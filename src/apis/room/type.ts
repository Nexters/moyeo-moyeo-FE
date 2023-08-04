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

// TODO: 추후 위 타입들은 types/index.ts로 분리
// TODO: 아래 API 타입도 depth 줄이기

export type API = {
  totalInfo: {
    get: {
      request: {
        roomId: string;
      };
      response: TotalInfo;
    };
  };
};
