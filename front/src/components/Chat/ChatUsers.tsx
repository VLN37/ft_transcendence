import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { TableUser } from '../../models/TableUser';
import { emptyUser, User } from '../../models/User';
import api from '../../services/api';
import userStorage from '../../services/userStorage';
import { PublicProfile } from '../Profile/profile.public';

function UserMenu(props: { user: TableUser }) {
  const [reload, setReload] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const me: User = userStorage.getUser() || emptyUser();
  const toast = useToast();

  async function blockUser() {
    const response: any = await api.blockUser(me.id, props.user.id);
    const status = response.status == 201 ? 'success' : 'error';
    const message = response.status == 201 ? '' : response.data.message;
    toast({
      title: 'User block request sent',
      status: status,
      description: message,
    })
    if (response.status == 201) {
      // me.blocked.push(props.user.id);
      await userStorage.updateUser();
    }
    setReload(!reload);
  }

  async function unblockUser() {
    const response: any = await api.unblockUser(me.id, props.user.id);
    const status = response.status == 200 ? 'success' : 'error';
    const message = response.status == 200 ? '' : response.data.message;
    toast({
      title: 'User unblock request sent',
      status: status,
      description: message,
    })
    if (response.status == 200) {
      // me.blocked = me.blocked.filter((user) => user.id !== props.user.id);
      await userStorage.updateUser();
    }
    setReload(!reload);
  }

  return (
    <Box padding={1}>
      <PublicProfile
        user={props.user}
        isOpen={isOpen}
        onClose={onClose}
      ></PublicProfile>
      <Menu isLazy>
        <MenuButton>{props.user.nickname}</MenuButton>
        <MenuList>
          <MenuItem onClick={onOpen}>view profile</MenuItem>
          {me.blocked.find((user: User) => props.user.id == user.id)
            ? <MenuItem onClick={unblockUser}>unblock user</MenuItem>
            : <MenuItem onClick={blockUser}>block user</MenuItem>}

        </MenuList>
      </Menu>
    </Box>
  );
}

export function ChatUsers(props: { users: User[] }) {
  const userList = props.users.map((user: User, i: number) => {
    const tableuser = TableUser(user);
    return <UserMenu key={i} user={tableuser}></UserMenu>;
    // <Text key={i}>{user.profile.nickname}</Text>
  });
  console.log('users: ', props.users);
  return <>{userList}</>;
}
