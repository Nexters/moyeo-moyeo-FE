import { useEffect, useState } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';

import { Team } from '@/types.old';
import { isValidRoomId } from '@/utils/room';

import NotFound from '../NotFound';
import { Admin } from './Admin';
import { Entry } from './Entry';
import { Player } from './Player';

const Room = () => {
  const [role, setRole] = useState<'admin' | 'player' | null>();
  const [exist, setExist] = useState<boolean>();
  const [teamId, setTeamId] = useState<Team['id'] | null>();
  const { teamBuildingUuid } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!teamBuildingUuid) return;
    setExist(isValidRoomId(teamBuildingUuid));
  }, [teamBuildingUuid]);

  useEffect(() => {
    if (searchParams.get('role') === 'admin') {
      setRole('admin');
      setSearchParams(undefined, { replace: true });
    }
    // @note: 한번만 실행되어야 함
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // @todo: room id로 방정보를 불러온 뒤에도 존재하지 않으면 그때 NotFound를 띄우기
  if (!teamBuildingUuid || !exist) return <NotFound />;
  if (!role) return <Entry setRole={setRole} setTeamId={setTeamId} />;
  return role === 'player' && !!teamId ? (
    <Player teamId={teamId} />
  ) : (
    <Admin teamBuildingUuid={teamBuildingUuid} />
  );
};

export default Room;
