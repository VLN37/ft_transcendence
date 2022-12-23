import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

// import NeonButton from './components/NeonButton';
import Layout from './pages/Layout';
import HomePage from './pages/home';
import CommunityPage from './pages/community';
import RankPage from './pages/rank';
import ChatPage from './pages/chat';
import LoginPage from './pages/login';
import AuthCallback from './pages/auth-callback';
import MatchPage from './pages/match';
import DirectMessagePage from './pages/direct-message';

import theme from './theme';

type User = {
  id: number;
  name: string;
};

type ProtectedRouteArgs = {
  children: any;
};

const ProtectedRoute = ({ children }: ProtectedRouteArgs) => {
  const token = localStorage.getItem('jwt-token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children || <Outlet />;
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="rank" element={<RankPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="dm" element={<DirectMessagePage />} />
          </Route>

          <Route path="match/:match_id" element={<MatchPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
