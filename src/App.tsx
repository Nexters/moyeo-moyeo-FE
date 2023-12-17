import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import '@/font.css';
import '@/index.css';
import CommonLayout from '@/layouts/CommonLayout';
import MobileLayout from '@/layouts/MobileLayout';
import Create from '@/pages/Create';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import Survey from '@/pages/Survey';
import TeamBuilding from '@/pages/TeamBuilding';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<CommonLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/:teamBuildingUuid" element={<TeamBuilding />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route element={<MobileLayout />}>
            <Route path="/forms/:teamBuildingUuid" element={<Survey />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
      <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
