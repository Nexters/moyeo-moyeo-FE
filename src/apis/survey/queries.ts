import { useQuery } from '@tanstack/react-query';

import { httpClient } from '../http';
import { API } from '../type';

export const useGetTotalInfoForSurvey = (
  teamBuildingUuid?: API['getTotalInfoForSurvey']['request']['teamBuildingUuid'],
) => {
  type Response = API['getTotalInfoForSurvey']['response'];

  return useQuery({
    queryKey: ['survey', teamBuildingUuid],
    queryFn: async () => {
      if (!teamBuildingUuid) throw 'teamBuildingUuid is undefined';
      return await httpClient.get<Response>(
        `/api/surveys/team-building/${teamBuildingUuid}/teams`,
      );
    },
    enabled: !!teamBuildingUuid,
  });
};
