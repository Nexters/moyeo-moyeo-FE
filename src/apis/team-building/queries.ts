import { useQuery } from '@tanstack/react-query';

import { httpClient } from '@/apis/http';
import { type API } from '@/apis/type';

export const useGetTotalInfo = (
  teamBuildingUuid?: API['getTotalInfo']['request']['teamBuildingUuid'],
) => {
  return useQuery(
    ['totalInfo', teamBuildingUuid],
    async () => {
      if (!teamBuildingUuid) throw new Error('teamBuildingUuid is required');

      const data = await httpClient.get<API['getTotalInfo']['response']>(
        `/api/team-building/${teamBuildingUuid}`,
      );
      console.log(data);
      return data;
    },
    {
      enabled: !!teamBuildingUuid,
    },
  );
};
