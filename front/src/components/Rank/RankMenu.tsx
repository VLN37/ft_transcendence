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
import { api, chatApi } from '../../services/api_index';
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

export function RankMenu(props: any) {
  const url = `${process.env.REACT_APP_BACK_HOSTNAME}/users/${props.id}/friend_requests`;
  const toast = useToast();
  let navigate = useNavigate();
  let response;

  async function clickCallback() {
    const user: User = userStorage.getUser() || emptyUser();

    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/JSON',
        },
        body: JSON.stringify({
          user_id: user.id,
        }),
      });
    } catch (error) {
      return;
    }

    const body = await response.json();
    const status = response.ok ? 'success' : 'error';
    const message = response.ok ? '' : body.message;
    if (response.ok) await userStorage.updateUser();
    toast({
      title: 'Friend request sent',
      status: status,
      description: message,
    });
  }

  function sendUserMessage() {
    // chatApi.setDMSocket(api);
    navigate(`/dm?user=${props.id}`);
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Menu>
      <MenuButton>{props.input}</MenuButton>
      <MenuList>
        {/* MenuItems are not rendered unless Menu is open */}
        <MenuItem onClick={clickCallback}>add friend</MenuItem>
        <MenuItem onClick={sendUserMessage}>send a message</MenuItem>
        <MenuItem onClick={onOpen}>match history</MenuItem>
        <MatchHistory
          isOpen={isOpen}
          onClose={onClose}
          username={props.input}
        ></MatchHistory>
        {/* <MenuItem>Open Closed Tab</MenuItem> */}
        {/* <MenuItem>Open File</MenuItem> */}
      </MenuList>
    </Menu>
  );
}
