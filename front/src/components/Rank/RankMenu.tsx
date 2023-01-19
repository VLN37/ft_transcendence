import {
  Box,
  useToast,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { emptyUser, User } from '../../models/User';
import { mmApi, userApi } from '../../services/api_index';
import userStorage from '../../services/userStorage';
import { MatchHistory } from '../matchHistory/MatchHistory';

function AddToast() {
  const toast = useToast();
  return toast({ description: 'some text' });
}

function CustomToastExample() {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast({
          position: 'bottom-left',
          render: () => (
            <Box color="white" p={3} bg="blue.500">
              Hello World
            </Box>
          ),
        })
      }
    >
      Show Toast
    </Button>
  );
}

export function RankMenu(props: { username: string; id: number }) {
  const toast = useToast();
  const user: User = userStorage.getUser() || emptyUser();
  let navigate = useNavigate();
  let response;

  async function clickCallback() {
    response = await userApi.sendFriendRequest(user.id, props.id);

    const status = response?.status == 200 ? 'success' : 'error';
    const message = response?.status == 200 ? '' : response?.data.message;

    if (response?.status == 200) await userStorage.updateUser();

    toast({
      title: 'Friend request sent',
      status: status,
      description: message,
    });
  }

  function sendUserMessage() {
    navigate(`/dm?user=${props.id}`);
  }

  async function gameInvite() {
    const response: any = await mmApi.sendGameRequest(user, props.id);
	if (!response) return;
    const status = response.status == 201 ? 'success' : 'error';
    const message = response.status == 201 ? '' : response.data.message;
    toast({
      title: 'Game request sent',
      status: status,
      description: message,
    });
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Menu>
      <MenuButton
        px={4}
        py={2}
        transition="all 0.2s"
        borderRadius="md"
        borderWidth="1px"
        _hover={{ bg: 'blue.700' }}
        _expanded={{ bg: 'blue.400' }}
        _focus={{ boxShadow: 'outline' }}
      >
        {props.username}
      </MenuButton>
      <MenuList>
        {/* MenuItems are not rendered unless Menu is open */}
        <MenuItem onClick={clickCallback}>add friend</MenuItem>
        <MenuItem onClick={sendUserMessage}>send a message</MenuItem>
        <MenuItem onClick={onOpen}>match history</MenuItem>
        <MenuItem onClick={gameInvite}>invite to game</MenuItem>
        <MatchHistory
          isOpen={isOpen}
          onClose={onClose}
          username={props.username}
          id={props.id}
        ></MatchHistory>
        {/* <MenuItem>Open Closed Tab</MenuItem> */}
        {/* <MenuItem>Open File</MenuItem> */}
      </MenuList>
    </Menu>
  );
}
