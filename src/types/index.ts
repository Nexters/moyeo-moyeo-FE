export type Round =
  | 'FIRST_ROUND'
  | 'SECOND_ROUND'
  | 'THIRD_ROUND'
  | 'FORTH_ROUND'
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
  roundStatus: Round;
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
  joinedTeamUuid: string | null;
  profileLink: string;
  selectedRound: Round | null;
};

export type TotalInfo = {
  teamBuildingInfo: TeamBuilding;
  teamInfoList: Team[];
  userInfoList: User[];
};

export type Choice = '1지망' | '2지망' | '3지망' | '4지망' | '팀 구성 조정';

// survey
export type SurveyFormInputs = {
  userName: string;
  userProfile: string;
  position: string;
  choices: string[];
};
export type SurveyFormResult = Array<{
  field: string;
  value: string;
}>;

// sse
// pick-user
export type PickUserEvent = {
  teamUuid: Team['uuid'];
  teamName: string;
  pickUserUuids: User['uuid'][];
};

// change-round
export type ChangeRoundEvent = Round;

// create-user
export type CreateUserEvent = User;

// delete-user
export type DeleteUserEvent = User['uuid'];

// adjust-user
export type AdjustUserEvent = User;
