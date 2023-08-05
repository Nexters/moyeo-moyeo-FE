import { TotalInfo as TotalInfoType } from '@/types';

export type TotalInfo = {
  get: {
    request: {
      roomId: string;
    };
    response: TotalInfoType;
  };
};
