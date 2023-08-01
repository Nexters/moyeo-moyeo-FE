import React, { Fragment, useMemo, useState } from 'react';

import { toast } from 'react-hot-toast';
import Select from 'react-select';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { mockTeams } from '@/mock/data';
import { css } from '@/styled-system/css';
import { stack } from '@/styled-system/patterns';
import { MAX_LENGTH__USER_NAME, MAX_ROUND, POSITION } from '@/utils/const';

const ROUND_ARRAY = Array.from({ length: MAX_ROUND }, (_, i) => i);

const positionOption = Object.entries(POSITION).map(([value, label]) => ({
  value,
  label,
}));

const choicesOption = mockTeams.map((team) => ({
  value: team.id,
  label: team.id,
}));

const Survey = () => {
  const [inputs, setInputs] = useState({
    userName: '',
    position: '',
    choices: Array.from({ length: MAX_ROUND }, () => ''),
  });

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputs({ ...inputs, userName: value.replace(/\s/g, '') });
  };

  const validation = useMemo(() => {
    return {
      isEmptyUserName: inputs.userName === '',
      isEmptyPosition: inputs.position === '',
      hasEmptyChoices: inputs.choices.includes(''),
    };
  }, [inputs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIXME
    if (validation.isEmptyUserName) {
      toast.error('이름을 입력해주세요');
      return;
    }
    if (validation.isEmptyPosition) {
      toast.error('직군을 선택해주세요');
      return;
    }
    if (validation.hasEmptyChoices) {
      toast.error('지망을 모두 선택해주세요');
      return;
    }
    console.log(inputs);
    toast.success('설문조사가 제출되었습니다');
  };

  return (
    <div
      className={stack({
        width: '360px',
        backgroundColor: 'rgba(16, 28, 41, 0.6)',
        borderRadius: '40px',
        padding: '24px',
        gap: '10px',
        marginX: '8px',
      })}
    >
      <h1
        className={css({
          fontSize: '24px',
          color: 'white',
          fontWeight: '700',
        })}
      >
        넥스터즈 23기 팀 빌딩
      </h1>
      <label
        htmlFor="userName"
        className={css({
          fontSize: '16px',
          color: 'white',
        })}
      >
        이름 *
      </label>
      <Input
        placeholder="이름을 입력해주세요"
        name="userName"
        id="userName"
        maxLength={MAX_LENGTH__USER_NAME}
        value={inputs.userName}
        onChange={handleChangeName}
      />
      <label className={css({ color: 'white' })}>직군 *</label>
      <Select
        options={positionOption}
        onChange={(e) => {
          setInputs({ ...inputs, position: e?.value || '' });
        }}
        placeholder="포지션을 선택해주세요"
      />
      {ROUND_ARRAY.map((round) => {
        return (
          <Fragment key={round}>
            <label className={css({ color: 'white' })}>{round + 1}지망 *</label>
            <Select
              options={choicesOption}
              placeholder={`${round + 1}지망을 선택해주세요`}
              menuPortalTarget={document.body}
              menuShouldScrollIntoView={false}
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
          </Fragment>
        );
      })}
      <Button
        onClick={handleSubmit}
        visual="blue"
        className={css({
          margin: '0 auto',
          marginTop: '12px',
          width: 'fit-content',
        })}
      >
        제출하기
      </Button>
    </div>
  );
};

export default Survey;
