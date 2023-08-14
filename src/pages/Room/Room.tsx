import { useEffect, useState } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';

import { useGetTotalInfo } from '@/apis/team-building/queries';
import { Team } from '@/types.old';

import NotFound from '../NotFound';
import { Admin } from './Admin';
import { Entry } from './Entry';
import { Player } from './Player';

const Room = () => {
  const [role, setRole] = useState<'admin' | 'player' | null>();
  const [teamId, setTeamId] = useState<Team['id'] | null>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { teamBuildingUuid } = useParams();
  const { isLoading, data: totalInfo } = useGetTotalInfo(teamBuildingUuid);

  useEffect(() => {
    if (searchParams.get('role') === 'admin') {
      setRole('admin');
      setSearchParams(undefined, { replace: true });
    }
    // @note: 한번만 실행되어야 함
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return 'loading...';
  if (!teamBuildingUuid || !totalInfo) return <NotFound />;
  if (!role)
    return <Entry setRole={setRole} teamId={teamId} setTeamId={setTeamId} />;
  return role === 'player' && !!teamId ? (
    <Player teamId={teamId} />
  ) : (
    <Admin teamBuildingUuid={teamBuildingUuid} />
  );
};

export default Room;
