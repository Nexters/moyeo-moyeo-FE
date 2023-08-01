import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import '@/index.css';
import Create from '@/pages/Create';
import Home from '@/pages/Home';
import Room from '@/pages/Room';
import Survey from '@/pages/Survey';
import { vstack } from '@/styled-system/patterns';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Background />}>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/survey" element={<Survey />} />
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
        height: '100vh',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <Outlet />
    </main>
  );
};

export default App;
