import { EmailIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import GameInvite from '../../components/GameInvite/GameInvite';
import MatchFinder from '../../components/MatchFinder';
import NeonButton from '../../components/NeonButton';
import { Profile } from '../../components/Profile/profile';
import { emptyUser } from '../../models/User';
import { api, chatApi } from '../../services/api_index';
import userStorage from '../../services/userStorage';

import './style.css';

function DesktopMenu() {
  return (
    <Box className={'menu-itens'}>
      <Link to="/">
        <NeonButton>HOME</NeonButton>
      </Link>
      <Link to="/rank">
        <NeonButton>RANK</NeonButton>
      </Link>
      <Link to="/community">
        <NeonButton>COMMUNITY</NeonButton>
      </Link>
    </Box>
  );
}

function MobileMenu() {
  return (
    <Menu>
      <MenuButton
        className={'menu-mobile'}
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
        fontSize="30px"
        size="lg"
      />
      <MenuList width={'90vw'}>
        <Link to={'/'}>
          <MenuItem>HOME</MenuItem>
        </Link>
        <Link to={'/rank'}>
          <MenuItem>RANK</MenuItem>
        </Link>
        <Link to={'/community'}>
          <MenuItem>COMMUNITY</MenuItem>
        </Link>
      </MenuList>
    </Menu>
  );
}

export default function Layout({ setUser }: any) {
  const navigate = useNavigate();
  const location = useLocation();
  const [pathname, setPathname] = useState('/');
  const [notification, setNotification] = useState(0);
  const [avatar, setAvatar] = useState<string>(
    localStorage.getItem('avatar') || '',
  );

  const user = userStorage.getUser() || emptyUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    chatApi.subscribeDirectMessageNotify(() => {
      setPathname((prevPathname) => {
        if (prevPathname == '/dm') setNotification(0);
        else setNotification((prevNotification) => prevNotification + 1);
        return prevPathname;
      });
    });

    return () => chatApi.unsubscribeDirectMessageNotify();
  }, []);

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
          <Flex mt={'1rem'}>
            <Flex flex={1} my={'auto'}>
              <DesktopMenu />
              <MobileMenu />
            </Flex>
            <Flex flex={3} justifyContent={'end'} gap={'2.5rem'}>
              <Box my={'auto'}>
                <Link
                  onClick={() => setNotification(0)}
                  className="button"
                  to="/dm"
                >
                  <IconButton
                    variant="link"
                    fontSize="60px"
                    size="lg"
                    aria-label="Message Notification"
                    icon={<EmailIcon />}
                    mt={'0.5rem'}
                  />
                  {notification ? (
                    <Badge className="badge" ml="1" colorScheme="green">
                      {`+${notification}`}
                    </Badge>
                  ) : null}
                </Link>
              </Box>
              <GameInvite />
              <Image
                onClick={onOpen}
                marginTop={'15px'}
                borderRadius="full"
                boxSize="65px"
                src={avatar}
                border={'2px'}
                boxShadow={'dark-lg'}
              />
              <Profile isOpen={isOpen} onClose={onClose} setAvatar={setAvatar}/>
              <Button
                marginY={'auto'}
                onClick={() => {
                  api.removeToken();
                  localStorage.removeItem('jwt-token');
                  navigate('/login');
                }}
              >
                logout
              </Button>
            </Flex>
          </Flex>
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
