import { useEffect, useLayoutEffect, useState } from 'react';

import { useSetAtom } from 'jotai';
import { useParams, useSearchParams } from 'react-router-dom';

import { BASE_URL } from '@/apis/http';
import { useGetTotalInfo } from '@/apis/team-building/queries';
import Spinner from '@/components/Spinner';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import { eventSourceAtom } from '@/store/atoms';
import { Team } from '@/types';
import { resolveUrl } from '@/utils/url';

import NotFound from '../NotFound';
import { Admin } from './Admin';
import { Entry } from './Entry';
import { Player } from './Player';

const TeamBuilding = () => {
  const [role, setRole] = useState<'admin' | 'player' | null>(null);
  const [teamUuid, setTeamUuid] = useState<Team['uuid'] | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { teamBuildingUuid } = useParams();
  const { isLoading, data: totalInfo } = useGetTotalInfo(teamBuildingUuid);
  const setEventSource = useSetAtom(eventSourceAtom);

  useLayoutEffect(() => {
    if (searchParams.get('role') === 'admin') {
      setRole('admin');
      setSearchParams(undefined, { replace: true });
    }
    // @note: 한번만 실행되어야 함
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // @note: root component에서 EventSource를 생성하고, atom에 저장한다.
    const eventSource = new EventSource(
      resolveUrl(
        BASE_URL,
        `notification/team-building/${teamBuildingUuid}/subscribe`,
      ),
    );
    setEventSource(eventSource);
    return () => eventSource.close();
  }, [setEventSource, teamBuildingUuid]);

  useBeforeUnload(role !== null);

  if (isLoading) return <Spinner />;
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
    <Player teamUuid={teamUuid} teamBuildingUuid={teamBuildingUuid} />
  ) : (
    <Admin teamBuildingUuid={teamBuildingUuid} />
  );
};

export default TeamBuilding;
