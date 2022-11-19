import {
  Box,
  useToast,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Button,
  TableCaption,
  TableContainer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'
import { emptyUser, User } from '../../models/User';
import api from '../../services/api';
import userStorage from '../../services/userStorage';

function AddToast() {
  const toast = useToast();
  return toast({ description: 'some text' })
}

function CustomToastExample() {
  const toast = useToast()
  return (
    <Button
      onClick={() =>
        toast({
          position: 'bottom-left',
          render: () => (
            <Box color='white' p={3} bg='blue.500'>
              Hello World
            </Box>
          ),
        })
      }
    >
      Show Toast
    </Button>
  )
}

export function RankMenu(props: any) {
  const url = `http://localhost:3000/users/${props.id}/friend_requests`;
  const toast = useToast();

  async function clickCallback() {
    const user: User = userStorage.getUser() || emptyUser();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON',
      },
      body: JSON.stringify({
        user_id: user.id,
      }),
    });

    const body = await response.json();
    const status = response.ok ? 'success' : 'error';
    const message = response.ok ? '' : body.message;
    if (response.ok) userStorage.updateUser();
    toast({
      title: 'Friend request sent',
      status: status,
      description: message,
    });
  }
  return (
    <Menu isLazy>
      <MenuButton>{props.input}</MenuButton>
      <MenuList>
        {/* MenuItems are not rendered unless Menu is open */}
        <MenuItem onClick={clickCallback} >addFriend</MenuItem>
        {/* <MenuItem>Open Closed Tab</MenuItem> */}
        {/* <MenuItem>Open File</MenuItem> */}
      </MenuList>
    </Menu>
  )
}
