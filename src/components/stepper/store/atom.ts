import { atom } from 'jotai';

type StepperAtomType = {
  activeStep: number;
  totalCount: number;
};

export const stepperAtom = atom<StepperAtomType>({
  activeStep: 0,
  totalCount: 0,
});
