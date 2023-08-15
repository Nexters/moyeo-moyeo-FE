import { atom } from 'jotai';

export const isShowLottieBackgroundState = atom<boolean>(false);
export const eventSourceAtom = atom<EventSource | null>(null);
