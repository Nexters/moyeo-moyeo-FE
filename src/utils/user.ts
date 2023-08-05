import { User } from '@/typesOld';

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const compareUser = (a: User, b: User) => {
  if (a.position === b.position) {
    return a.name.localeCompare(b.name);
  }
  return a.position.localeCompare(b.position);
};
