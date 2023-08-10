import { createContext, useContext } from 'react';

type StepperAtomType = {
  activeStep: number;
};

const StepperContext = createContext<StepperAtomType>({
  activeStep: 0,
});

export const useStepperContext = () => {
  return useContext(StepperContext);
};

export default StepperContext;
