import { TotalInfo } from '@/types';

export type API = {
  getTotalInfo: {
    request: {
      roomId: string;
    };
    response: TotalInfo;
  };
};
