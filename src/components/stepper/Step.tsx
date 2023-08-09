import React from 'react';

import { useAtomValue } from 'jotai';

import { stepperAtom } from '@/components/stepper/store';
import { css } from '@/styled-system/css';
import { hstack } from '@/styled-system/patterns';

type StepProps = {
  children: React.ReactNode;
  id: number;
};

export const Step = ({ id, children }: StepProps) => {
  const { activeStep, totalCount } = useAtomValue(stepperAtom);
  return (
    <>
      <span
        className={hstack({
          color: activeStep === id ? 'gray.5' : 'rgba(255, 255, 255, 0.53)',
          rounded: '10px',
          p: '10px 20px',
          textStyle: 'h3',
          gap: '0',
          bg: activeStep === id ? 'purple.60' : 'transparent',
          fill: activeStep === id ? 'gray.5' : 'rgba(255, 255, 255, 0.53)',
          borderWidth: '1px',
          borderColor:
            activeStep === id ? 'purple.60' : 'rgba(255, 255, 255, 0.19)',
          transition: 'all 0.2s ease-in-out',
        })}
      >
        {children}
      </span>
      {totalCount - 1 !== id && (
        <span
          className={css({
            width: '20px',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.19)',
            borderRadius: '5px',
          })}
        />
      )}
    </>
  );
};
