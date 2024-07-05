export const toLocaleString = (date: string) => {
  if (!date) return '';

  const convertedDate =
    date[date.length - 1] === 'Z' ? new Date(date) : new Date(`${date}Z`);
  return convertedDate.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
  });
};
