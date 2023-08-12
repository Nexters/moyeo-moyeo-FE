export const isTrulyEmptyString = (str?: string | null) => {
  return str == null || str.trim() === '';
};
