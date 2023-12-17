import { useCallback } from 'react';

import { Updater, useQuery, useQueryClient } from '@tanstack/react-query';

import { httpClient } from '@/apis/http';
import { type API } from '@/apis/type';

export const useGetTotalInfo = (
  teamBuildingUuid?: API['getTotalInfo']['request']['teamBuildingUuid'],
  polling?: boolean,
) => {
  type Response = API['getTotalInfo']['response'];

  const queryClient = useQueryClient();

  const setTotalInfo = useCallback(
    (updater: Updater<Response | undefined, Response | undefined>) => {
      queryClient.setQueryData<Response>(
        ['totalInfo', teamBuildingUuid],
        updater,
      );
    },
    [queryClient, teamBuildingUuid],
  );

  const queryResult = useQuery({
    queryKey: ['totalInfo', teamBuildingUuid],
    queryFn: async () => {
      if (!teamBuildingUuid) throw new Error('teamBuildingUuid is required');

      const data = await httpClient.get<Response>(
        `/api/team-building/${teamBuildingUuid}`,
      );
      // @fixme: 제거할 것
      console.log(data);
      return data;
    },
    enabled: !!teamBuildingUuid,
    refetchInterval: polling ? 10000 : false,
    refetchIntervalInBackground: polling,
  });

  return {
    ...queryResult,
    setTotalInfo,
  };
};
