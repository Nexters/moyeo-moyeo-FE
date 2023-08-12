import { useMemo, useState } from 'react';

import { toast } from 'react-hot-toast';

import { useCreateUser } from '@/apis/survey/mutations';
import { useGetTotalInfoForSurvey } from '@/apis/survey/queries';
import { Select } from '@/components/Select';
import { css } from '@/styled-system/css';
import { stack } from '@/styled-system/patterns';
import { Position } from '@/types';
import {
  MAX_LENGTH__USER_NAME,
  MAX_LENGTH__USER_PROFILE,
  MAX_ROUND,
  POSITION_LIST,
} from '@/utils/const';

const ROUND_ARRAY = Array.from({ length: MAX_ROUND }, (_, i) => i);

export type SurveyFormProps = {
  teamBuildingUuid: string;
  onAfterSubmit: () => void;
};

export const SurveyForm = ({
  teamBuildingUuid,
  onAfterSubmit,
}: SurveyFormProps) => {
  const query = useGetTotalInfoForSurvey(teamBuildingUuid);
  const mutation = useCreateUser();

  const [inputs, setInputs] = useState({
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
          toast.success('설문조사가 제출되었습니다');
          onAfterSubmit();
        },
      },
    );
  };

  return (
    <section
      className={stack({
        flex: '1',
        width: '100%',
        maxWidth: '520px',
        padding: '120px 30px 130px',
        color: 'gray.5',
        wordBreak: 'keep-all',
        gap: '50px',
      })}
    >
      <header>
        <h1
          className={css({
            textStyle: 'h1',
            marginBottom: '8px',
          })}
        >
          {query.data?.teamBuildingInfo.teamBuildingName}
        </h1>

        <p
          className={css({
            textStyle: 'p2',
          })}
        >
          한 번 제출한 설문은 변경할 수 없습니다. <br />
          안내된 시간을 엄수해주세요.
        </p>
      </header>

      <form className={stack({ gap: '36px' })} onSubmit={handleSubmit}>
        <FormControl label="이름">
          <input
            name="userName"
            placeholder="이름을 입력해주세요"
            maxLength={MAX_LENGTH__USER_NAME}
            value={inputs.userName}
            onChange={(e) =>
              setInputs({
                ...inputs,
                userName: e.target.value.replace(/\s/g, ''),
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
            placeholder="Github, Behance, Instagram 등"
            maxLength={MAX_LENGTH__USER_PROFILE}
            value={inputs.userProfile}
            onChange={(e) =>
              setInputs({
                ...inputs,
                userProfile: e.target.value.replace(/\s/g, ''),
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
            onChange={(e) => {
              setInputs({ ...inputs, position: e?.value || '' });
            }}
          />
        </FormControl>

        {ROUND_ARRAY.map((round) => {
          return (
            <FormControl label={`${round + 1}지망`} key={round}>
              <Select
                isError={
                  isClickedSubmit &&
                  validation.hasEmptyChoices &&
                  inputs.choices[round] === ''
                }
                options={query.data?.teamInfoList.map((team) => ({
                  value: team.uuid,
                  label: `${team.pmName} - ${team.teamName}`,
                }))}
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

        <button
          type="submit"
          className={css({
            marginTop: '34px', // 70px만큼 떨어트리기 위함 (36 + 34)
            padding: '14px 0',
            borderRadius: '20px',
            backgroundColor: 'yellow.80',
            fontSize: '20px',
            fontFamily: 'GmarketSansBold',
            color: 'gray.5',
            boxShadow:
              '2px 2px 6px 0px rgba(255, 255, 255, 0.25) inset, -2px -2px 6px 0px #A13A00 inset',
            cursor: 'pointer',
          })}
        >
          설문 제출하기
        </button>
      </form>
    </section>
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
