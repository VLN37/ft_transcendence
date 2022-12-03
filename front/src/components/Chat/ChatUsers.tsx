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
import { Channel } from '../../models/Channel';
import { TableUser } from '../../models/TableUser';
import { emptyUser, User } from '../../models/User';
import api from '../../services/api';
import userStorage from '../../services/userStorage';
import { PublicProfile } from '../Profile/profile.public';

function UserMenu(props: {
  channel: Channel,
  user: TableUser,
  user2: User,
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
    const response: any = await api.delAdmin(props.user.id, props.channel.id);
    const status = response.status == 200 ? 'success' : 'error';
    const message = response.status == 200 ? '' : response.data.message;
    toast({
      title: 'Delete admin request sent',
      status: status,
      description: message,
    })
    if (response.status == 200)
      props.channel.admins
        .splice(props.channel.admins
        .findIndex((user) => user.id == props.user.id)
      );
    setReload(!reload);
  }

  async function addAdmin() {
    const response: any = await api.addAdmin(props.user.id, props.channel.id);
    const status = response.status == 201 ? 'success' : 'error';
    const message = response.status == 201 ? '' : response.data.message;
    toast({
      title: 'Add admin request sent',
      status: status,
      description: message,
    });
    if (response.status == 201)
      props.channel.admins.push(props.user2);
    setReload(!reload);
  }

  async function banUser() {
    const response: any = await api.banUser(
      props.channel.id, props.user.id, 360
      );
    const status = response.status == 201 ? 'success' : 'error';
    const message = response.status == 201
      ? '5 minutes timeout'
      : response.data.message;
    toast({
      title: 'User ban request sent',
      status: status,
      description: message,
    });
    if (response.status == 201)
      props.channel.banned_users.push(props.user.id);
    setReload(!reload);
  }

  async function unbanUser() {
    const response: any = await api.unbanUser(props.channel.id, props.user.id);
    const status = response.status == 200 ? 'success' : 'error';
    const message = response.status == 200 ? '' : response.data.message;
    toast({
      title: 'User unban request sent',
      status: status,
      description: message,
    });
    if (response.status == 200)
      props.channel.banned_users.splice(
        props.channel.banned_users.indexOf(props.user.id), 1
      );
    setReload(!reload);
  }

  const isMyself = me.id == props.user.id;
  const amOwner = me.id == props.channel.owner_id && me.id != props.user.id;
  const isBlocked = me.blocked.find((user) => props.user.id == user.id);
  const isAdmin = props.channel.admins.find((user) => props.user.id == user.id);
  const amAdmin = props.channel.admins.find((user) => me.id == user.id);
  const isBanned = props.channel.banned_users.find(i => i == props.user.id);
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
              ? (
                isBanned
                  ? <MenuItem onClick={unbanUser}>unban user</MenuItem>
                  : <MenuItem onClick={banUser}>ban user</MenuItem>
              )
              : null
          }
        </MenuList>
      </Menu>
    </Box>
  );
}

export function ChatUsers(props: {
  channel: Channel,
}) {
  const userList = props.channel.users.map((user: User, i: number) => {
    const tableuser = TableUser(user);
    return (
      <UserMenu channel={props.channel} key={i} user={tableuser} user2={user}
    ></UserMenu>
    );
  });
  return <>{userList}</>;
}
