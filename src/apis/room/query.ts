import { useQuery } from '@tanstack/react-query';

import { httpClient } from '@/apis/http';
import { type TotalInfo } from '@/apis/room/type';

export const useGetTotalInfo = (params: TotalInfo['get']['request']) => {
  const getTotalInfo = async () => {
    const data = await httpClient.get<TotalInfo['get']['response']>(
      `rooms/${params.roomId}/info`,
    );
    return data;
  };
  return useQuery(['roomInfo'], getTotalInfo);
};
