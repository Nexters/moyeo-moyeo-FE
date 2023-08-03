import { useQuery } from '@tanstack/react-query';

import { roomInfo } from '@/apis/room/api';
import { type RoomInfo } from '@/apis/room/type';

export const useGetRoomInfo = (props: RoomInfo['get']['request']) => {
  return useQuery(['roomInfo'], () => roomInfo.get({ ...props }));
};
