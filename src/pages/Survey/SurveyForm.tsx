import { useCallback, useMemo, useState } from 'react';

import { toast } from 'react-hot-toast';

import { useCreateUser } from '@/apis/survey/mutations';
import { useGetTotalInfoForSurvey } from '@/apis/survey/queries';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { useBeforeUnload } from '@/hooks/useBeforeUnload';
import { css } from '@/styled-system/css';
import { stack } from '@/styled-system/patterns';
import { Position, SurveyFormInputs, SurveyFormResult, Team } from '@/types';
import {
  MAX_LENGTH__USER_NAME,
  MAX_LENGTH__USER_PROFILE,
  MAX_ROUND,
  POSITION_LIST,
} from '@/utils/const';
import { isTrulyEmptyString } from '@/utils/string';

const ROUND_ARRAY = Array.from({ length: MAX_ROUND }, (_, i) => i);

export type SurveyFormProps = {
  teamBuildingUuid: string;
  onAfterSubmit: (result: SurveyFormResult) => void;
};

export const SurveyForm = ({
  teamBuildingUuid,
  onAfterSubmit,
}: SurveyFormProps) => {
  const { data: totalInfoForSurvey } =
    useGetTotalInfoForSurvey(teamBuildingUuid);
  const mutation = useCreateUser();

  const [inputs, setInputs] = useState<SurveyFormInputs>({
    userName: '',
    userProfile: '',
    position: '',
    choices: Array.from({ length: MAX_ROUND }, () => ''),
  });
  const [isClickedSubmit, setIsClickedSubmit] = useState(false);

  const validation = useMemo(() => {
    return {
      isEmptyUserName: inputs.userName === '',
      isEmptyPosition: inputs.position === '',
      hasEmptyChoices: inputs.choices.includes(''),
      isDuplicatedChoices: new Set(inputs.choices).size !== MAX_ROUND,
      isEmptyFormInputs: Object.values(inputs).every((value) => {
        if (typeof value === 'string') return isTrulyEmptyString(value);
        return value.every(isTrulyEmptyString);
      }),
    };
  }, [inputs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsClickedSubmit(true);

    if (validation.isEmptyUserName) {
      return toast.error('이름을 입력해주세요');
    }
    if (validation.isEmptyPosition) {
      return toast.error('직군을 선택해주세요');
    }
    if (validation.hasEmptyChoices) {
      return toast.error('지망을 모두 선택해주세요');
    }
    if (
      validation.isDuplicatedChoices &&
      !confirm('중복된 지망이 있습니다. 계속하시겠습니까?')
    ) {
      return;
    }

    mutation.mutate(
      {
        teamBuildingUuid,
        body: {
          name: inputs.userName,
          position: inputs.position as Position,
          profileLink: inputs.userProfile,
          choices: inputs.choices,
        },
      },
      {
        onSuccess: () => {
          toast.success('설문이 제출되었습니다');

          const result: SurveyFormResult = [
            { field: '이름', value: inputs.userName },
            { field: '소개 페이지 (선택)', value: inputs.userProfile },
            {
              field: '직군',
              value:
                POSITION_LIST.find((v) => v.value === inputs.position)?.label ||
                '',
            },
            ...inputs.choices.map((choice, i) => {
              const team = totalInfoForSurvey?.teamInfoList.find(
                (team) => team.uuid === choice,
              );
              return {
                field: `${i + 1}지망`,
                value: team ? getLabelByTeam(team) : '',
              };
            }),
          ];
          onAfterSubmit(result);
        },
        onError: () => {
          toast.error('제출에 실패했습니다. 잠시 후 다시 시도해주세요.');
        },
      },
    );
  };

  const getLabelByTeam = useCallback((team: Team) => {
    return `${team.pmName} - ${team.teamName}`;
  }, []);

  useBeforeUnload(!validation.isEmptyFormInputs);

  return (
    <form
      className={stack({
        flex: '1',
        width: '100%',
        maxWidth: '520px',
        padding: '120px 20px',
        color: 'gray.5',
        wordBreak: 'keep-all',
        gap: '0',
      })}
      onSubmit={handleSubmit}
    >
      <h1
        className={css({
          textStyle: 'h1',
          marginBottom: '8px',
        })}
      >
        {totalInfoForSurvey?.teamBuildingInfo.teamBuildingName}
      </h1>

      <p
        className={css({
          textStyle: 'p2',
          marginBottom: '50px',
        })}
      >
        한 번 제출한 설문은 변경할 수 없습니다. <br />
        안내된 시간을 엄수해주세요.
      </p>

      <section className={stack({ gap: '36px', marginBottom: '70px' })}>
        <FormControl label="이름">
          <input
            name="userName"
            placeholder="이름을 입력해주세요"
            maxLength={MAX_LENGTH__USER_NAME}
            autoComplete="off"
            value={inputs.userName}
            onChange={(e) =>
              setInputs({
                ...inputs,
                userName: e.target.value
                  .replace(/\s/g, '')
                  .slice(0, MAX_LENGTH__USER_NAME),
              })
            }
            className={css({
              padding: '16px',
              width: '100%',
              height: '50px',
              backgroundColor: 'rgba(12, 13, 14, 0.50)',
              borderRadius: '12px',
              border:
                isClickedSubmit && validation.isEmptyUserName
                  ? '2px solid token(colors.red.60)'
                  : '2px solid transparent',
              textStyle: 'h4',
              color: 'gray.5',
              outline: 'none',
              _focus: {
                border: '2px solid token(colors.purple.80)',
              },
            })}
          />
        </FormControl>

        <FormControl label="소개 페이지(선택)">
          <input
            name="userProfile"
            placeholder="노션 자기소개 페이지 혹은 개인 웹사이트 등"
            maxLength={MAX_LENGTH__USER_PROFILE}
            autoComplete="off"
            value={inputs.userProfile}
            onChange={(e) =>
              setInputs({
                ...inputs,
                userProfile: e.target.value
                  .replace(/\s/g, '')
                  .slice(0, MAX_LENGTH__USER_PROFILE),
              })
            }
            className={css({
              padding: '16px',
              width: '100%',
              height: '50px',
              backgroundColor: 'rgba(12, 13, 14, 0.50)',
              borderRadius: '12px',
              textStyle: 'h4',
              color: 'gray.5',
              outline: 'none',
              border: '2px solid transparent',
              _focus: {
                border: '2px solid token(colors.purple.80)',
              },
            })}
          />
        </FormControl>

        <FormControl label="직군">
          <Select
            isError={isClickedSubmit && validation.isEmptyPosition}
            placeholder="포지션을 선택해주세요"
            options={POSITION_LIST}
            value={POSITION_LIST.find((v) => v.value === inputs.position)}
            onChange={(e) => {
              setInputs({ ...inputs, position: e?.value || '' });
            }}
          />
        </FormControl>

        {ROUND_ARRAY.map((round) => {
          const options = totalInfoForSurvey?.teamInfoList.map((team) => ({
            value: team.uuid,
            label: `${team.pmName} - ${team.teamName}`,
          }));
          const value = options?.find(
            (option) => option.value === inputs.choices[round],
          );

          return (
            <FormControl label={`${round + 1}지망`} key={round}>
              <Select
                isError={
                  isClickedSubmit &&
                  validation.hasEmptyChoices &&
                  inputs.choices[round] === ''
                }
                options={options}
                value={value}
                placeholder={`${round + 1}지망을 선택해주세요`}
                onChange={(e) => {
                  if (!e) return;
                  setInputs({
                    ...inputs,
                    choices: inputs.choices.map((choice, i) => {
                      if (i !== round) return choice;
                      return e.value;
                    }),
                  });
                }}
              />
            </FormControl>
          );
        })}
      </section>

      <Button
        type="submit"
        size="small"
        color="secondary"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? '제출 중...' : '설문 제출하기'}
      </Button>
    </form>
  );
};

type FormControlProps = {
  label: string;
  children: React.ReactNode;
};

const FormControl = ({ label, children }: FormControlProps) => {
  return (
    <label className={stack({ gap: '15px' })}>
      <legend
        className={css({
          textStyle: 'h3',
          lineHeight: 'normal',
        })}
      >
        {label}
      </legend>
      {children}
    </label>
  );
};
