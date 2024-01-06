export const keepScroll = (callback: () => void) => {
  const scrollHeightBefore = document.documentElement.scrollHeight;

  callback();

  Promise.resolve().then(() => {
    const scrollHeightAfter = document.documentElement.scrollHeight;
    const diff = scrollHeightAfter - scrollHeightBefore;
    const isScrollAtBottom =
      Math.abs(
        window.innerHeight + window.scrollY - document.body.scrollHeight,
      ) < 1;

    // @note: 화면이 더 길어지거나, 스크롤이 맨 아래에 있지 않는 경우
    // 마우스 포인터가 동일한 요소를 가리키도록 하고자 스크롤 위치를 조절한다.
    if (diff >= 0 || !isScrollAtBottom) {
      window.scrollTo(0, window.scrollY + diff);
    }
  });
};
