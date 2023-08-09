import React, { useEffect } from 'react';

import { useSetAtom } from 'jotai';

import { stepperAtom } from '@/components/stepper/store';
import { cx } from '@/styled-system/css';
import { hstack } from '@/styled-system/patterns';

type StepperProps = {
  activeStep: number;
  children: React.ReactNode;
  className?: string;
};

export const Stepper = ({ activeStep, children, className }: StepperProps) => {
  const setActiveStepAtom = useSetAtom(stepperAtom);

  useEffect(() => {
    setActiveStepAtom({
      totalCount: React.Children.count(children),
      activeStep,
    });
  }, [activeStep]);

  return <div className={cx(hstack({ gap: '0' }), className)}>{children}</div>;
};
