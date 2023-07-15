import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import Create from '@/pages/Create';
import Home from '@/pages/Home';
import Room from '@/pages/Room';
import { vstack } from '@/styled-system/patterns';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Background />}>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/:roomId" element={<Room />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const Background = () => {
  return (
    <main
      className={vstack({
        width: '100vw',
        height: '100vh',
        backgroundImage:
          'url(https://framerusercontent.com/images/liA5ttAIx68WSEit1ECid8di30.jpg)',
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
