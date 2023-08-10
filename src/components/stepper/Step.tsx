import React from 'react';

import { hstack } from '@/styled-system/patterns';

import { useStepperContext } from './StepperContext';

type StepProps = {
  id: number;
  children: React.ReactNode;
};

export const Step = ({ id, children }: StepProps) => {
  const { activeStep } = useStepperContext();
  return (
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
  );
};
