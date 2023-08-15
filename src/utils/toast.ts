import { toast } from 'react-hot-toast';

import { playSound } from './sound';

const success: (typeof toast)['success'] = (...args) => {
  playSound('토스트');
  return toast.success(...args);
};
const error: (typeof toast)['error'] = (...args) => {
  playSound('에러_토스트');
  return toast.error(...args);
};

export const toastWithSound = {
  success,
  error,
};
