import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import NeonButton from './components/NeonButton';
import Layout from './pages/Layout';
import HomePage from './pages/home';
import CommunityPage from './pages/community';
import RankPage from './pages/rank';
import ChatPage from './pages/chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="rank" element={<RankPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
