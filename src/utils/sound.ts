const sounds = {
  배경: new Audio('/sounds/password-infinity-123276.mp3'),
  토스트: new Audio('/sounds/soft-notice-146623.mp3'),
  에러_토스트: new Audio('/sounds/error-2-126514.mp3'),
  버튼_클릭: new Audio('/sounds/button-124476.mp3'), // 링크 복사 및 기타 버튼 클릭
  페이지_전환: new Audio('/sounds/interface-124464.mp3'),
  팀원_선택: new Audio('/sounds/mouse-click-117076.mp3'),
  팀원_확정: new Audio('/sounds/decidemp3-14575.mp3'),
  라운드_변경: new Audio('/sounds/call-to-attention-123107.mp3'),
  팀빌딩_완료: new Audio('/sounds/success-fanfare-trumpets-6185.mp3'),
};

export const playSound = (name: keyof typeof sounds, loop = false) => {
  const sound = sounds[name];

  sound.volume = 0.3;
  sound.loop = loop;
  return sound.play();
};

export const stopSound = (name: keyof typeof sounds) => {
  const sound = sounds[name];
  sound.pause();
  sound.currentTime = 0;
};
