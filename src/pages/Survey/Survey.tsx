import React, { Fragment, useState } from 'react';

import toast from 'react-hot-toast';

import { MAX_ROUND, POSITION } from '@/constants/game';
import { mockTeams } from '@/mock/data';
import * as S from '@/pages/Survey/Survey.style';
import {
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

const Survey = () => {
  const [inputs, setInputs] = useState({
    name: '',
    userPosition: '',
    selectedPosition: Array.from({ length: MAX_ROUND }) as string[],
  });

  const handleChange = (e: React.ChangeEvent | React.MouseEvent) => {
    const { name, value } = e.target as HTMLButtonElement | HTMLInputElement;
    setInputs({ ...inputs, [name]: value });
  };

  const handleChangeSelectedPosition = (e: React.MouseEvent) => {
    const { name, value } = e.target as HTMLButtonElement;
    if (inputs.selectedPosition.includes(value)) {
      toast.error('이미 선택한 포지션입니다.');
      return;
    }
    setInputs({
      ...inputs,
      selectedPosition: inputs.selectedPosition.map((v, i) =>
        i === Number(name) ? value : v,
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIXME
    console.log(inputs);
  };

  return (
    <S.Container>
      <S.Title>넥스터즈 23기 팀 빌딩</S.Title>

      <S.Label htmlFor="name">이름 *</S.Label>
      <Input
        color="white"
        placeholder="이름을 입력해주세요"
        size="lg"
        name="name"
        value={inputs.name}
        onChange={handleChange}
      />
      <S.Label>직군 *</S.Label>
      <Menu>
        <MenuButton as={Button} textAlign="left" size="lg">
          {POSITION[inputs.userPosition] || '포지션을 선택해주세요'}
        </MenuButton>
        <MenuList>
          {Object.keys(POSITION).map((key) => {
            return (
              <MenuItem
                key={key}
                onClick={handleChange}
                value={key}
                id={POSITION[key]}
                name="userPosition"
                textAlign="left"
              >
                {POSITION[key]}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
      {Array.from({ length: MAX_ROUND }, (_, i) => i).map((round) => {
        return (
          <Fragment key={round}>
            <S.Label>{round + 1}지망 *</S.Label>
            <Menu>
              <MenuButton
                as={Button}
                textAlign="left"
                size="lg"
                textOverflow="ellipsis"
                overflow="hidden"
                whiteSpace="nowrap"
                css={{
                  '& > span': {
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  },
                }}
              >
                {inputs.selectedPosition[round] || '라운드를 선택해주세요'}
              </MenuButton>
              <MenuList>
                {mockTeams.map((team) => {
                  return (
                    <MenuItem
                      key={`${round}-${team.id}`}
                      onClick={handleChangeSelectedPosition}
                      value={team.id}
                      id={team.id}
                      name={round.toString()}
                    >
                      {team.id}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
          </Fragment>
        );
      })}

      <S.SubmitButton onClick={handleSubmit}>제출하기</S.SubmitButton>
    </S.Container>
  );
};

export default Survey;
