export type User = {
  id: string;
  name: string;
  position: string;
  choices: Team['id'][];
  joined_team_id?: string | null;
};

export type Team = {
  /**
   * 설문지에서 팀 이름 그대로 가지고 있음.
   * ex) id = "1. 홍길동 - 팀 빌딩 서비스"
   */
  id: string;
  /**
   * id에서 팀 번호를 가져옴.
   * ex) if id = "1. 홍길동 - 팀 빌딩 서비스", then num = 1
   */
  num: number;
  /**
   * id에서 팀 이름을 가져옴.
   * ex) if id = "1. 홍길동 - 팀 빌딩 서비스", then name = "홍길동 - 팀 빌딩 서비스"
   */
  name: string;
};
