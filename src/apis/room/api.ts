import { getAsync } from '@/apis/fetch';
import { type RoomInfo } from '@/apis/room/type';

export const roomInfo = {
  get: async ({ roomId }: RoomInfo['get']['request']) => {
    const data = await getAsync<RoomInfo['get']['response']>(
      `rooms/${roomId}/info`,
    );
    return data;
  },
};
