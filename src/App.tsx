import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';

import Create from '@/pages/Create';
import Home from '@/pages/Home';
import Room from '@/pages/Room';
import Survey from '@/pages/Survey/Survey';
import { ThemeProvider } from '@/styles/theme';
import { ChakraProvider } from '@chakra-ui/react';
import styled from '@emotion/styled';

function App() {
  return (
    <ChakraProvider>
      <ThemeProvider>
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
      </ThemeProvider>
    </ChakraProvider>
  );
}

const Background = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

const Container = styled.main`
  width: 100%;
  min-width: fit-content;
  height: 100vh;
  background-image: url(/images/temporal-bg.jpg);
  background-size: cover;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default App;
