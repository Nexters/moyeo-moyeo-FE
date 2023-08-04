import { useQuery } from '@tanstack/react-query';

import { httpClient } from '@/apis/http';
import { type API } from '@/apis/room/type';

export const totalInfo = {
  get: async ({ roomId }: API['totalInfo']['get']['request']) => {
    const data = await httpClient.get<API['totalInfo']['get']['response']>(
      `rooms/${roomId}/info`,
    );
    return data;
  },
};

export const useGetTotalInfo = (params: API['totalInfo']['get']['request']) => {
  return useQuery(['roomInfo'], () => totalInfo.get({ ...params }));
};
