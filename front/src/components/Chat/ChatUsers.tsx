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
  user2: User,
  admin: User[],
  owner_id: number,
  channel_id: number,
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

  async function delAdmin() {
    const response: any = await api.delAdmin(props.user.id, props.channel_id);
    const status = response.status == 200 ? 'success' : 'error';
    const message = response.status == 200 ? '' : response.data.message;
    toast({
      title: 'Delete admin request sent',
      status: status,
      description: message,
    })
    if (response.status == 200)
      props.admin.splice(
        props.admin.findIndex((user) => user.id == props.user.id)
      );
    setReload(!reload);
  }

  async function addAdmin() {
    const response: any = await api.addAdmin(props.user.id, props.channel_id);
    const status = response.status == 201 ? 'success' : 'error';
    const message = response.status == 201 ? '' : response.data.message;
    toast({
      title: 'Add admin request sent',
      status: status,
      description: message,
    });
    if (response.status == 201)
      props.admin.push(props.user2);
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
                  ? <MenuItem onClick={delAdmin}>remove admin</MenuItem>
                  : <MenuItem onClick={addAdmin}>give admin</MenuItem>
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
  channel_id: number,
}) {
  const userList = props.users.map((user: User, i: number) => {
    const tableuser = TableUser(user);
    return (
      <UserMenu
        owner_id={props.owner_id}
        channel_id={props.channel_id}
        admin={props.admin}
        key={i}
        user={tableuser}
        user2={user}
      ></UserMenu>
    );
  });
  console.log('users: ', props.users);
  console.log('admins: ', props.admin);
  return <>{userList}</>;
}
