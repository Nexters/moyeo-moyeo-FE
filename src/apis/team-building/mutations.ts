import { useMutation } from '@tanstack/react-query';

import { httpClient } from '../http';
import { API } from '../type';

export const useSelectUsers = () => {
  type RequestBody = API['selectUsers']['request']['body'];
  type Response = API['selectUsers']['response'];

  return useMutation({
    mutationFn: async ({
      teamBuildingUuid,
      teamUuid,
      body,
    }: API['selectUsers']['request']) => {
      return await httpClient.post<Response, RequestBody>(
        `/api/team-building/${teamBuildingUuid}/teams/${teamUuid}/users`,
        body,
      );
    },
  });
};
