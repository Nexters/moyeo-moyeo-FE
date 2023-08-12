import { useQuery } from '@tanstack/react-query';

import { httpClient } from '@/apis/http';
import { type API } from '@/apis/type';

export const useGetTotalInfo = ({
  teamBuildingUuid,
}: API['getTotalInfo']['request']) => {
  return useQuery(['totalInfo', teamBuildingUuid], async () => {
    const data = await httpClient.get<API['getTotalInfo']['response']>(
      `/api/team-building/${teamBuildingUuid}`,
    );
    console.log(data);
    return data;
  });
};
