import React, { Fragment, useState } from 'react';

import { toast } from 'react-hot-toast';
import Select from 'react-select';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { MAX_ROUND, POSITION } from '@/constants/game';
import { mockTeams } from '@/mock/data';
import { css } from '@/styled-system/css';
import { stack } from '@/styled-system/patterns';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value.replace(/\s/g, '') });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIXME
    if (inputs.userName === '') {
      toast.error('이름을 입력해주세요');
      return;
    }
    if (inputs.position === '') {
      toast.error('직군을 선택해주세요');
      return;
    }
    if (inputs.choices.includes('')) {
      toast.error('지망을 모두 선택해주세요');
      return;
    }
    const isDuplicate = inputs.choices.some(
      (team, i) => inputs.choices.indexOf(team) !== i,
    );
    if (isDuplicate) {
      toast.error('팀은 중복되지 않게 선택해주세요');
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
        htmlFor="name"
        className={css({
          fontSize: '16px',
          color: 'white',
        })}
      >
        이름 *
      </label>
      <Input
        placeholder="이름을 입력해주세요"
        name="name"
        id="name"
        maxLength={50}
        value={inputs.userName}
        onChange={handleChange}
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
              onChange={(e) => {
                if (!e) return;
                setInputs({
                  ...inputs,
                  choices: inputs.choices.map((position, i) => {
                    if (i !== round) return position;
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
