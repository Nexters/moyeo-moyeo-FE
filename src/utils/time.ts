export const delay = (ms: number) => {
  if (ms < 0) throw new Error('ms must be positive');
  return new Promise((resolve) => setTimeout(resolve, ms));
};
