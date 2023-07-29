import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import '@/index.css';
import Create from '@/pages/Create';
import Home from '@/pages/Home';
import Room from '@/pages/Room';
import SseTest from '@/pages/SseTest';
import { vstack } from '@/styled-system/patterns';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Background />}>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/sse" element={<SseTest />} />
            <Route path="/:roomId" element={<Room />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

const Background = () => {
  return (
    <main
      className={vstack({
        width: '100%',
        minWidth: 'fit-content',
        height: '100vh',
        backgroundImage: 'url(/images/temporal-bg.jpg)',
        backgroundSize: 'cover',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
      })}
    >
      <Outlet />
    </main>
  );
};

export default App;
