import { StarIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Channel } from '../../models/Channel';
import { TableUser } from '../../models/TableUser';
import { emptyUser, User } from '../../models/User';
import { channelApi, mmApi } from '../../services/api_index';
import userStorage from '../../services/userStorage';
import { MatchHistory } from '../matchHistory/MatchHistory';
import { PublicProfile } from '../Profile/profile.public';

const CircleIcon = (props: any) => (
  <Icon viewBox='0 0 200 200' {...props}>
    <path
      fill='currentColor'
      d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    />
  </Icon>
)

function UserMenu(props: {
  channel: Channel,
  user: TableUser,
  user2: User,
}) {
  const [reload, setReload] = useState<boolean>(false);
  const me: User = userStorage.getUser() || emptyUser();
  const toast = useToast();

  const {
    isOpen: isProfileOpen,
    onOpen: openProfile,
    onClose: closeProfile,
  } = useDisclosure();
  const {
    isOpen: isHistoryOpen,
    onOpen: openHistory,
    onClose: closeHistory,
  } = useDisclosure();

  async function blockUser() {
    const response: any = await channelApi.blockUser(
      me.id, props.user.id
    );
    if (!response) return;
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
    const response: any = await channelApi.unblockUser(
      me.id, props.user.id
    );
    if (!response) return;
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
    const response: any = await channelApi.delAdmin(
      props.user.id, props.channel.id
    );
    if (!response) return;
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
    const response: any = await channelApi.addAdmin(
      props.user.id, props.channel.id
    );
    if (!response) return;
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
    const response: any = await channelApi.banUser(
      props.channel.id, props.user.id, 360
      );
    if (!response) return;
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
    const response: any = await channelApi.unbanUser(
      props.channel.id, props.user.id
    );
    if (!response) return;
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

  async function gameInvite() {
    const response: any = await mmApi.sendGameRequest(me, props.user.id);
	if (!response) return;
    const status = response.status == 201 ? 'success' : 'error';
    const message = response.status == 201 ? '' : response.data.message;
    toast({
      title: 'Game request sent',
      status: status,
      description: message,
    });
  }

  const isMyself = me.id == props.user.id;
  const amOwner = me.id == props.channel.owner_id && me.id != props.user.id;
  const isBlocked = me.blocked.find(user => props.user.id == user.id);
  const isAdmin = props.channel.admins.find(user => props.user.id == user.id);
  const amAdmin = props.channel.admins.find(user => me.id == user.id);
  const isBan = props.channel.banned_users.find(i => i.user_id == props.user.id);
  let color;
  if (props.user.status == 'ONLINE')
    color = 'green.500';
  else if (props.user.status == 'OFFLINE')
    color = 'grey.500';
  else
    color = 'red.500';
  return (
    <Box padding={1}>
      <PublicProfile
        user={props.user}
        isOpen={isProfileOpen}
        onClose={closeProfile}
      ></PublicProfile>
      <MatchHistory
        isOpen={isHistoryOpen}
        onClose={closeHistory}
        id={props.user.id}
        username={props.user.nickname}
      ></MatchHistory>
      <Menu isLazy>
        <MenuButton
          transition="all 0.2s"
          borderRadius='base'
          borderWidth="1px"
          borderColor={'gray.500'}
          _hover={{ bg: 'blue.700' }}
          _expanded={{ bg: 'blue.400' }}
          _focus={{ boxShadow: 'outline' }}
          color={isBan ? 'red' : 'white'}
        >
          <CircleIcon color={color}></CircleIcon>
          {isBlocked ? <ViewOffIcon></ViewOffIcon> : null}
          {isAdmin ? <StarIcon></StarIcon> : null}
          {props.user.nickname}
        </MenuButton>
        <MenuList>
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
          ) : null
          }
          {
            amAdmin && !isMyself
              ? (
              isBan
                ? <MenuItem onClick={unbanUser}>unban user</MenuItem>
                : <MenuItem onClick={banUser}>ban user</MenuItem>
            )
              : null
          }
          <MenuItem onClick={openProfile}>view profile</MenuItem>
          <MenuItem onClick={openHistory}>view match history</MenuItem>
          <MenuItem onClick={gameInvite}>invite to game</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
}

export function ChatUsers(props: { channel: Channel }) {
  const userList = props.channel.users.map((user: User, i: number) => {
    const tableuser = TableUser(user);
    return (
      <UserMenu
        channel={props.channel}
        key={i}
        user={tableuser}
        user2={user}
      ></UserMenu>
    );
  });
  return (
    <>
      <Text paddingLeft={1}>Channel members</Text>
      <hr></hr>
      {userList}
    </>
  );
}
