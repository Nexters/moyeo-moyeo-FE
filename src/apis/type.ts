import { Position, TotalInfo, User } from '@/types';

export type API = {
  // === 팀 빌딩 ===
  // 팀 빌딩 현황 조회
  getTotalInfo: {
    request: {
      teamBuildingUuid: string;
    };
    response: TotalInfo;
  };
  // 팀 빌딩 팀원 선택 요청
  selectUsers: {
    request: {
      teamBuildingUuid: string;
      teamUuid: string;
      body: {
        userUuids: string[];
      };
    };
    response: {
      userInfoList: User[];
    };
  };

  // === 유저 설문 ===
  // 팀 빌딩 팀 데이터 조회 (유저 선택 정보 제외)
  getTotalInfoForSurvey: {
    request: {
      teamBuildingUuid: string;
    };
    response: Pick<TotalInfo, 'teamBuildingInfo' | 'teamInfoList'>;
  };
  // 회원 생성 요청
  createUser: {
    request: {
      teamBuildingUuid: string;
      body: {
        name: string;
        position: Position;
        profileLink: string;
        choices: string[];
      };
    };
    response: User;
  };

  // === 어드민 ===
  // 팀 빌딩 생성 요청
  createTeamBuilding: {
    request: {
      body: {
        name: string;
        teams: {
          name: string;
          pmName: string;
          pmPosition: Position;
        }[];
      };
    };
    response: TotalInfo;
  };
  // 팀 빌딩 시작
  startTeamBuilding: {
    request: {
      teamBuildingUuid: string;
    };
    response: unknown;
  };
  deleteUser: {
    request: {
      teamBuildingUuid: string;
      userUuid: string;
    };
    response: unknown;
  };
  // 조정 단계 팀원 수정(단일 유저)
  adjustUser: {
    request: {
      teamBuildingUuid: string;
      userUuid: string;
      body: {
        teamUuid: string | null;
      };
    };
    response: User;
  };
  // 팀 빌딩 마치기
  finishTeamBuilding: {
    request: {
      teamBuildingUuid: string;
    };
    response: unknown;
  };
};
