import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import { isValidRoomId } from '@/utils/room';

import { Admin } from './Admin';
import { Entry } from './Entry';
import { NotFound } from './NotFound';
import { Player } from './Player';

const Room = () => {
  const [role, setRole] = useState<'admin' | 'player' | null>();
  const [exist, setExist] = useState<boolean>();
  const { roomId } = useParams();

  useEffect(() => {
    if (!roomId) return;
    setExist(isValidRoomId(roomId));
  }, [roomId]);

  if (!exist) return <NotFound />;
  if (!role) return <Entry handleRole={setRole} />;
  return role === 'player' ? <Player /> : <Admin />;
};

export default Room;
