import { HamburgerIcon, Search2Icon } from '@chakra-ui/icons';
import {
  Container,
  Flex,
  Grid,
  GridItem,
  IconButton,
  MenuButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import MatchFinder from '../../components/MatchFinder';
import NeonButton from '../../components/NeonButton';
import { Profile } from '../../components/Profile/profile';

import './style.css';

export default function Layout({ setUser }: any) {
  const [avatar, setAvatar] = useState<string>(
    JSON.parse(localStorage.getItem('user') || '').profile.avatar_path || '',
  );
  return (
    <Container
      maxW="1200px"
      h={'100vh'}
      maxHeight={'100vh'}
      overflowY={'hidden'}
    >
      <Grid
        gridTemplateColumns={'repeat(1, 1fr)'}
        gridTemplateRows={'repeat(12, 1fr)'}
        gridRowGap={'1rem'}
        h={'100%'}
      >
        <GridItem rowSpan={1} colSpan={1} maxW="100%">
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
        </GridItem>

        <GridItem rowSpan={10} colSpan={1} maxW="100%" overflow={'hidden'}>
          <Outlet />
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} maxW="100%">
          <Flex justifyContent={'center'}>
            <MatchFinder />
          </Flex>
        </GridItem>
      </Grid>
    </Container>
  );
}
