import { useMutation } from '@tanstack/react-query';

import { httpClient } from '../http';
import { API } from '../type';

export const useCreateUser = () => {
  type Response = API['createUser']['response'];
  type RequestBody = API['createUser']['request']['body'];

  return useMutation({
    mutationFn: async ({
      teamBuildingUuid,
      body,
    }: API['createUser']['request']) => {
      return await httpClient.post<Response, RequestBody>(
        `/api/surveys/team-building/${teamBuildingUuid}/users`,
        body,
      );
    },
  });
};
