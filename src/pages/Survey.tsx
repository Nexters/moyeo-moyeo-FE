import React, { Fragment, useRef, useState } from 'react';

import { toast } from 'react-hot-toast';
import Select, {
  ControlProps,
  Props,
  StylesConfig,
  components,
} from 'react-select';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { MAX_ROUND, POSITION } from '@/constants/game';
import { mockTeams } from '@/mock/data';
import { css } from '@/styled-system/css';
import { container, stack, vstack } from '@/styled-system/patterns';

const options = [
  { value: '바나나', label: '바나나' },
  { value: '사과', label: '사과' },
  { value: '딸기', label: '딸기' },
];

const ROUND_ARRAY = Array.from({ length: MAX_ROUND }, (_, i) => i);

const positionOption = Object.entries(POSITION).map(([value, label]) => ({
  value,
  label,
}));

const teamOption = mockTeams.map((team) => ({
  value: team.id,
  label: team.id,
}));

type Option = {
  value: string;
  label: string;
};

const isDuplicateChoice =
  (positions: string[]) => (currentRound: number, selectedPosition: string) => {
    return positions
      .filter((_, i) => i !== currentRound)
      .includes(selectedPosition);
  };

const Survey = () => {
  const [inputs, setInputs] = useState({
    name: '',
    userPosition: '',
    selectedPosition: Array.from({ length: MAX_ROUND }, () => ''),
  });
  const selectInputRef = useRef<any>();
  const [selectValue, setSelectValue] = useState('');

  const handleClearSelect = () => {
    if (selectInputRef.current) {
      console.log(':: ', selectInputRef.current?.clearValue);
      selectInputRef.current?.clearValue();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIXME
    console.log(inputs);
    toast.success('설문조사가 제출되었습니다');
  };

  return (
    <div
      className={stack({
        width: '600px',
        backgroundColor: 'rgba(12, 13, 14, 0.6)',
        borderRadius: '40px',
        padding: '24px',
        gap: '12px',
      })}
    >
      <h1
        className={css({
          fontSize: '24px',
          color: 'white',
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
        value={inputs.name}
        onChange={handleChange}
      />
      <label className={css({ color: 'white' })}>직군 *</label>
      <Select
        options={positionOption}
        onChange={(e) => {
          setInputs({ ...inputs, userPosition: e?.value || '' });
        }}
        placeholder="포지션을 선택해주세요"
      />

      {ROUND_ARRAY.map((round) => {
        return (
          <Fragment key={round}>
            <label className={css({ color: 'white' })}>{round + 1}지망 *</label>
            <Select
              ref={selectInputRef}
              options={teamOption}
              placeholder={`${round + 1}지망을 선택해주세요`}
              onChange={(e) => {
                console.log(':: ', e, inputs.selectedPosition[round]);
                if (!e) return;
                if (inputs.selectedPosition[round] === e.value) return;
                if (inputs.selectedPosition.includes(e.value)) {
                  toast.error('이미 선택한 포지션입니다');
                  handleClearSelect();
                  return;
                }
                setInputs({
                  ...inputs,
                  selectedPosition: inputs.selectedPosition.map(
                    (position, i) => {
                      if (i === round) return e.value;
                      return position;
                    },
                  ),
                });
              }}
              theme={(theme) => ({ ...theme, color: 'red' })}
            />
          </Fragment>
        );
      })}
      <Select
        ref={selectInputRef}
        onChange={(e) => {
          if (e) {
            setSelectValue(e.value);
          }
        }}
        options={options}
        placeholder="뚝딱을 선택하세요."
      />
      <button onClick={handleClearSelect}>clear</button>
      <Button
        onClick={handleSubmit}
        visual="blue"
        className={css({ marginTop: '12px' })}
      >
        제출하기
      </Button>
    </div>
  );
};

export default Survey;
