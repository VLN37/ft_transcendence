import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

// import NeonButton from './components/NeonButton';
import Layout from './pages/Layout';
import HomePage from './pages/home';
import CommunityPage from './pages/community';
import RankPage from './pages/rank';
import ChatPage from './pages/chat';
import LoginPage from './pages/login';
import { useState } from 'react';
import AuthCallback from './pages/auth-callback';

type User = {
  id: number;
  name: string;
};

type ProtectedRouteArgs = {
  user: User | null;
  children: any;
};

const ProtectedRoute = ({ user, children }: ProtectedRouteArgs) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children || <Outlet />;
};

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Layout setUser={setUser} />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="rank" element={<RankPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>

        <Route path="/login" element={<LoginPage user={user} />} />
        <Route
          path="/auth-callback"
          element={<AuthCallback setUser={setUser} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
