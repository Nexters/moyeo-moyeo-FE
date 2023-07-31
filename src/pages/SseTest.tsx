import { useEffect } from 'react';

import { useAtomValue, useSetAtom } from 'jotai';

import { eventSourceAtom } from '@/atoms/event-source';

const SseTest = () => {
  const setEventSource = useSetAtom(eventSourceAtom);

  useEffect(() => {
    // root component에서 EventSource를 생성하고, atom에 저장한다.
    const eventSource = new EventSource(`http://localhost:8080/sse`);
    setEventSource(eventSource);
    return () => eventSource.close();
  }, [setEventSource]);

  return (
    <div>
      테스트 페이지
      <SubComponent />
      <SubComponent />
      <SubComponent />
    </div>
  );
};

const SubComponent = () => {
  const eventSource = useAtomValue(eventSourceAtom);

  useEffect(() => {
    // 개별 컴포넌트에서 EventSource에 이벤트 리스너를 설정한다.
    const handler = (e: MessageEvent<string>) => {
      console.log(e.data);
    };

    eventSource?.addEventListener('message', handler);
    return () => eventSource?.removeEventListener('message', handler);
  }, [eventSource]);

  return <div>서브 컴포넌트</div>;
};

export default SseTest;
