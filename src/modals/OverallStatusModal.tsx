import { useMemo } from 'react';

import { useGetTotalInfo } from '@/apis/team-building/queries';
import { ReactComponent as CloseIcon } from '@/assets/icons/close.svg';
import { Chip } from '@/components/Chip';
import { ChipWithUser } from '@/components/ChipWithUser';
import { Modal } from '@/components/Modal';
import { css } from '@/styled-system/css';
import { hstack, vstack } from '@/styled-system/patterns';
import { Team, User } from '@/types';

type OverallStatusModalProps = {
  isOpen: boolean;
  onClose: () => void;
  teamBuildingUuid: string;
};

export const OverallStatusModal = ({
  isOpen,
  onClose,
  teamBuildingUuid,
}: OverallStatusModalProps) => {
  const { data } = useGetTotalInfo(teamBuildingUuid);
  const { teamInfoList, userInfoList } = data ?? {};

  const allMemberByTeam = useMemo(() => {
    const allMemberByTeam: Record<Team['pmName'], User[]> = {};

    teamInfoList?.forEach((team) => {
      const key = `${team.pmName} - ${team.teamName}`;

      allMemberByTeam[key] = [
        {
          uuid: 'pm',
          userName: team.pmName,
          position: team.pmPosition,
          choices: [],
          joinedTeamUuid: team.uuid,
          profileLink: '',
          selectedTeam: true,
        } as User,
        ...(userInfoList ?? []).filter(
          (user) => user.joinedTeamUuid === team.uuid,
        ),
      ];
    });

    allMemberByTeam['남은 인원'] = (userInfoList ?? []).filter(
      (user) => user.joinedTeamUuid === null,
    );

    return Object.entries(allMemberByTeam);
  }, [teamInfoList, userInfoList]);

  const renderUser = (selectUser: User) => {
    return <ChipWithUser key={selectUser.uuid} user={selectUser} />;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section
        className={vstack({
          width: '100%',
          maxHeight: '90vh',
          padding: '60px',
          gap: '48px',
          border: '1px solid rgba(255, 255, 255, 0.11)',
          backgroundColor: 'rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(50px)',
          borderRadius: '20px',
          overflow: 'auto',
        })}
      >
        <div
          className={hstack({
            width: '100%',
            gap: '24px',
            justifyContent: 'space-between',
          })}
        >
          <h2
            className={css({
              textStyle: 'h1',
              color: 'gray.5',
            })}
          >
            팀 빌딩 현황
          </h2>
          <CloseIcon
            onClick={onClose}
            className={css({ width: '40px', cursor: 'pointer' })}
          />
        </div>

        <div
          className={vstack({
            width: '100%',
            alignItems: 'flex-start',
            gap: '24px',
            overflow: 'auto',
          })}
        >
          <div className={hstack({ gap: '16px' })}>
            <Chip visual="first" label="1 지망" />
            <Chip visual="second" label="2 지망" />
            <Chip visual="third" label="3 지망" />
            <Chip visual="fourth" label="4 지망" />
            <Chip visual="extra" label="임의배정" />
            <Chip visual="pm" label="PM" />
          </div>

          <div
            className={css({
              width: '100%',
              backgroundColor: 'rgba(12, 13, 14, 0.50)',
              borderRadius: '20px',
              backdropFilter: 'blur(50px)',
              padding: '12px',
              overflow: 'auto',
            })}
          >
            <table
              className={css({
                width: '100%',
                fontSize: '16px',
                color: 'gray.20',
                '& tr': {
                  height: '52px',
                  borderBottom: '1px solid token(colors.gray.30)',
                },
                '& tbody tr:last-child': {
                  borderBottom: 'none',
                },
                '& thead tr': {
                  fontWeight: 'bold',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.28)',
                },
                '& th': {
                  textAlign: 'left',
                  paddingLeft: '16px',
                },
                '& td': {
                  verticalAlign: 'top',
                },
                '& td:first-child': {
                  verticalAlign: 'middle',
                  paddingLeft: '16px',
                },
              })}
            >
              <thead>
                <tr>
                  <th className={css({ width: '160px' })}>팀 이름</th>
                  <th className={css({ width: '160px' })}>디자이너</th>
                  <th className={css({ width: '160px' })}>프론트엔드</th>
                  <th className={css({ width: '160px' })}>백엔드</th>
                  <th className={css({ width: '160px' })}>iOS</th>
                  <th className={css({ width: '160px' })}>안드로이드</th>
                </tr>
              </thead>
              <tbody>
                {allMemberByTeam.map(([teamName, members]) => (
                  <tr key={teamName}>
                    <td>{teamName}</td>

                    <td>
                      <div
                        className={vstack({
                          alignItems: 'flex-start',
                          padding: '16px',
                          gap: '8px',
                        })}
                      >
                        {members
                          .filter((user) => user.position === 'DESIGNER')
                          .map(renderUser)}
                      </div>
                    </td>

                    <td>
                      <div
                        className={vstack({
                          alignItems: 'flex-start',
                          padding: '16px',
                          gap: '8px',
                        })}
                      >
                        {members
                          .filter((user) => user.position === 'FRONT_END')
                          .map(renderUser)}
                      </div>
                    </td>

                    <td>
                      <div
                        className={vstack({
                          alignItems: 'flex-start',
                          padding: '16px',
                          gap: '8px',
                        })}
                      >
                        {members
                          .filter((user) => user.position === 'BACK_END')
                          .map(renderUser)}
                      </div>
                    </td>

                    <td>
                      <div
                        className={vstack({
                          alignItems: 'flex-start',
                          padding: '16px',
                          gap: '8px',
                        })}
                      >
                        {members
                          .filter((user) => user.position === 'IOS')
                          .map(renderUser)}
                      </div>
                    </td>

                    <td>
                      <div
                        className={vstack({
                          alignItems: 'flex-start',
                          padding: '16px',
                          gap: '8px',
                        })}
                      >
                        {members
                          .filter((user) => user.position === 'ANDROID')
                          .map(renderUser)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Modal>
  );
};
