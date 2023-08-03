export type RoomInfo = {
  get: {
    request: {
      roomId: string;
    };
    response: {
      uuid: string;
      teamName: string;
      pmName: string;
      pmPosition: string;
      selectDone: boolean;
    };
  };
};
