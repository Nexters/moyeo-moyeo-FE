import { useQuery } from '@tanstack/react-query';

import { httpClient } from '@/apis/http';
import { type RoomInfo } from '@/apis/room/type';

export const roomInfo = {
  get: async ({ roomId }: RoomInfo['get']['request']) => {
    const data = await httpClient.get<RoomInfo['get']['response']>(
      `rooms/${roomId}/info`,
    );
    return data;
  },
};

export const useGetRoomInfo = (params: RoomInfo['get']['request']) => {
  return useQuery(['roomInfo'], () => roomInfo.get({ ...params }));
};
