import { Link, Outlet } from 'react-router-dom';
import MatchFinder from '../../components/MatchFinder';
import NeonButton from '../../components/NeonButton';

import './style.css';

export default function Layout({ setUser }: any) {
  return (
    <div className="main-container">
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
        <div>profile picture</div>
        <button onClick={() => setUser(null)}>logout</button>
      </nav>

      <Outlet />
      <div className="match-finder-wrapper">
        <MatchFinder />
      </div>
    </div>
  );
}
