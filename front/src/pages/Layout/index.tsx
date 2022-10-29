import { Box, Image } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';
import MatchFinder from '../../components/MatchFinder';
import NeonButton from '../../components/NeonButton';
import { Profile } from '../../components/Profile/profile';

import './style.css';

export default function Layout({ setUser }: any) {
  const link = JSON.parse(localStorage.getItem('user') || '')
                   .profile.avatar_path || '';
  return (
    <Box paddingX="10%">
      <nav className="top-bar">
        <ul className="nav-links">
          <li>
            <Link to="/">
              <NeonButton>HOME</NeonButton>
            </Link>
          </li>
          <li>
            <Link to="/rank">
              <NeonButton>RANK</NeonButton>
            </Link>
          </li>
          <li>
            <Link to="/community">
              <NeonButton>COMMUNITY</NeonButton>
            </Link>
          </li>
          <li>
            <Link to="/chat">
              <NeonButton>CHAT</NeonButton>
            </Link>
          </li>
        </ul>
        <Profile />
        <button onClick={() => setUser(null)}>logout</button>
      </nav>

      <Outlet />
      <div className="match-finder-wrapper" >
        <MatchFinder />
      </div>
    </Box>
  );
}
