import { useEffect } from 'react';

const SseTest = () => {
  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:8080/sse`);

    eventSource.addEventListener('open', console.log);
    eventSource.addEventListener('message', console.warn);
    eventSource.addEventListener('error', console.error);

    return () => eventSource.close();
  }, []);

  return <div>테스트 페이지</div>;
};

export default SseTest;
