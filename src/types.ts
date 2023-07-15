export type User = {
  id: string;
  name: string;
  position: string;
  choices: Team['name'][];
  joined_team_id?: string | null;
};

export type Team = {
  id: string;
  num: number;
  name: string;
};
