import { StarIcon } from '@chakra-ui/icons';
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

function UserMenu(props: {
  user: TableUser,
  admin: User[],
  owner_id: number,
}) {
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
    await userStorage.updateUser();
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
    await userStorage.updateUser();
    setReload(!reload);
  }

  const isMyself = me.id == props.user.id;
  const amOwner = me.id == props.owner_id && me.id != props.user.id;
  const isBlocked = me.blocked.find((user) => props.user.id == user.id);
  const isAdmin = props.admin.find((user) => props.user.id == user.id);
  const amAdmin = props.admin.find((user) => me.id == user.id);
  console.log('isMyself: ', isMyself);
  console.log('isBlocked: ', isBlocked);
  return (
    <Box padding={1}>
      <PublicProfile
        user={props.user}
        isOpen={isOpen}
        onClose={onClose}
      ></PublicProfile>
      <Menu isLazy>
        <MenuButton>
          {isAdmin ? <StarIcon></StarIcon> : null}
          {props.user.nickname}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={onOpen}>view profile</MenuItem>
          <MenuItem>invite to game</MenuItem>
          {
            isMyself
              ? null
              : (
                isBlocked
                  ? <MenuItem onClick={unblockUser}>unblock user</MenuItem>
                  : <MenuItem onClick={blockUser}>block user</MenuItem>
              )
          }
          {
            amOwner && !isMyself
              ? (
                isAdmin
                  ? <MenuItem>remove admin</MenuItem>
                  : <MenuItem>give admin</MenuItem>
              )
              : null
          }
          {
            amAdmin && !isMyself
              ? <MenuItem>ban user</MenuItem>
              : null
          }
        </MenuList>
      </Menu>
    </Box>
  );
}

export function ChatUsers(props: {
  users: User[],
  admin: User[],
  owner_id: number,
}) {
  const userList = props.users.map((user: User, i: number) => {
    const tableuser = TableUser(user);
    return (
      <UserMenu
        owner_id={props.owner_id}
        admin={props.admin}
        key={i}
        user={tableuser}
      ></UserMenu>
    );
  });
  console.log('users: ', props.users);
  console.log('admins: ', props.admin);
  return <>{userList}</>;
}
