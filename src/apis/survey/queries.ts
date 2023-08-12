import { useQuery } from '@tanstack/react-query';

import { httpClient } from '../http';
import { API } from '../type';

export const useGetTotalInfoForSurvey = ({
  teamBuildingUuid,
}: API['getTotalInfoForSurvey']['request']) => {
  type Response = API['getTotalInfoForSurvey']['response'];

  return useQuery(['survey', teamBuildingUuid], async () => {
    return await httpClient.get<Response>(
      `/api/surveys/team-building/${teamBuildingUuid}/teams`,
    );
  });
};
