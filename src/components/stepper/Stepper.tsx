import React, { Fragment } from 'react';

import StepperContext from '@/components/stepper/StepperContext';
import { css, cx } from '@/styled-system/css';
import { hstack } from '@/styled-system/patterns';

type StepperProps = {
  activeStep: number;
  children: React.ReactNode;
  className?: string;
};

export const Stepper = ({ activeStep, children, className }: StepperProps) => {
  const childrenArray = React.Children.toArray(children).filter(
    Boolean,
  ) as React.ReactElement[];
  const steps = childrenArray.map((step, index) => {
    return (
      <Fragment key={`${step.key}`}>
        {React.cloneElement(step, {
          id: index,
        })}
        {index !== childrenArray.length - 1 && (
          <span
            className={css({
              width: '20px',
              height: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.19)',
              borderRadius: '5px',
            })}
          />
        )}
      </Fragment>
    );
  });

  return (
    <StepperContext.Provider value={{ activeStep }}>
      <div className={cx(hstack({ gap: '0' }), className)}>{steps}</div>
    </StepperContext.Provider>
  );
};
