import { useMutation } from '@tanstack/react-query';

import { httpClient } from '../http';
import { API } from '../type';

export const useCreateTeamBuilding = () => {
  type Response = API['createTeamBuilding']['response'];
  type RequestBody = API['createTeamBuilding']['request']['body'];

  return useMutation(async ({ body }: API['createTeamBuilding']['request']) => {
    return await httpClient.post<Response, RequestBody>(
      `/api/admin/team-building`,
      body,
    );
  });
};

export const useAdjustUser = () => {
  type Response = API['adjustUser']['response'];
  type RequestBody = API['adjustUser']['request']['body'];

  return useMutation(
    async ({
      teamBuildingUuid,
      userUuid,
      body,
    }: API['adjustUser']['request']) => {
      return await httpClient.post<Response, RequestBody>(
        `/api/admin/team-building/${teamBuildingUuid}/users/${userUuid}`,
        body,
      );
    },
  );
};

export const useFinishTeamBuilding = () => {
  type Response = API['finishTeamBuilding']['response'];

  return useMutation(
    async ({ teamBuildingUuid }: API['finishTeamBuilding']['request']) => {
      return await httpClient.put<Response, void>(
        `/api/admin/team-building/${teamBuildingUuid}/finish`,
        undefined,
      );
    },
  );
};
