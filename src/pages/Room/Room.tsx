import { useEffect, useState } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';

import { Team } from '@/types';
import { isValidRoomId } from '@/utils/room';

import { Admin } from './Admin';
import { Entry } from './Entry';
import { NotFound } from './NotFound';
import { Player } from './Player';

const Room = () => {
  const [role, setRole] = useState<'admin' | 'player' | null>();
  const [exist, setExist] = useState<boolean>();
  const [teamId, setTeamId] = useState<Team['id'] | null>();
  const { roomId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!roomId) return;
    setExist(isValidRoomId(roomId));
  }, [roomId]);

  useEffect(() => {
    if (searchParams.get('role') === 'admin') {
      setRole('admin');
      setSearchParams();
    }
  }, [searchParams, setSearchParams]);

  if (!exist) return <NotFound />;
  if (!role) return <Entry setRole={setRole} setTeamId={setTeamId} />;
  return role === 'player' && !!teamId ? <Player teamId={teamId} /> : <Admin />;
};

export default Room;
