import { BrowserRouter, Route, Routes } from 'react-router-dom';

import '@/index.css';
import Create from '@/pages/Create';
import Home from '@/pages/Home';
import Room from '@/pages/Room';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/:roomId" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
