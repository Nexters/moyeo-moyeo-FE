import { useLayoutEffect, useState } from 'react';

import { useParams, useSearchParams } from 'react-router-dom';

import { useGetTotalInfo } from '@/apis/team-building/queries';
import { Team } from '@/types';

import NotFound from '../NotFound';
import { Admin } from './Admin';
import { Entry } from './Entry';
import { Player } from './Player';

const Room = () => {
  const [role, setRole] = useState<'admin' | 'player' | null>(null);
  const [teamUuid, setTeamUuid] = useState<Team['uuid'] | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { teamBuildingUuid } = useParams();
  const { isLoading, data: totalInfo } = useGetTotalInfo(teamBuildingUuid);

  useLayoutEffect(() => {
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
    return (
      <Entry
        teamBuildingUuid={teamBuildingUuid}
        teamUuid={teamUuid}
        setRole={setRole}
        setTeamUuid={setTeamUuid}
      />
    );
  return role === 'player' && !!teamUuid ? (
    // @fixme: 플레이어 페이지 api 연동 시 teamId는 teamUuid로 변경하면 좋을 듯
    <Player teamId={teamUuid} />
  ) : (
    <Admin teamBuildingUuid={teamBuildingUuid} />
  );
};

export default Room;
