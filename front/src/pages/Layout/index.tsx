import { EmailIcon } from '@chakra-ui/icons';
import {
  Badge,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import MatchFinder from '../../components/MatchFinder';
import NeonButton from '../../components/NeonButton';
import { Profile } from '../../components/Profile/profile';
import { iDirectMessage } from '../../models/DirectMessage';
import { emptyUser } from '../../models/User';
import { chatApi } from '../../services/api_index';
import userStorage from '../../services/userStorage';

import './style.css';

export default function Layout({ setUser }: any) {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(0);
  const [avatar, setAvatar] = useState<string>(
    JSON.parse(localStorage.getItem('user') || '').profile.avatar_path || '',
  );

  const user = userStorage.getUser() || emptyUser();

  chatApi.subscribeDirectMessage((message: iDirectMessage) => {
    if (message.sender.id != user.id) setNotification(notification + 1);
  });

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
                <Link
                  onClick={() => setNotification(0)}
                  className="button"
                  to="/dm"
                >
                  <IconButton
                    variant="link"
                    fontSize="50px"
                    size="lg"
                    aria-label="Message Notification"
                    icon={<EmailIcon />}
                  />
                  {notification ? (
                    <Badge className="badge" ml="1" colorScheme="green">
                      {`+${notification}`}
                    </Badge>
                  ) : null}
                </Link>
              </li>
            </ul>
            <Profile />
            <Button
              marginY={'auto'}
              onClick={() => {
                localStorage.removeItem('jwt-token');
                navigate('/login');
              }}
            >
              logout
            </Button>
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
