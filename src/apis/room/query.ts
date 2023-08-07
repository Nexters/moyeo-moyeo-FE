import { useQuery } from '@tanstack/react-query';

import { httpClient } from '@/apis/http';
import { type API } from '@/apis/room/type';

export const useGetTotalInfo = (params: API['getTotalInfo']['request']) => {
  const getTotalInfo = async () => {
    const data = await httpClient.get<API['getTotalInfo']['response']>(
      `rooms/${params.roomId}/info`,
    );
    return data;
  };
  return useQuery(['roomInfo'], getTotalInfo);
};
