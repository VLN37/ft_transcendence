import { CheckIcon, CloseIcon, StarIcon } from '@chakra-ui/icons';
import {
  Box,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Channel } from '../../models/Channel';
import { TableUser } from '../../models/TableUser';
import { emptyUser, User } from '../../models/User';
import { channelApi, userApi } from '../../services/api_index';
import userStorage from '../../services/userStorage';
import { PublicProfile } from '../Profile/profile.public';

const CircleIcon = (props: any) => (
  <Icon viewBox='0 0 200 200' {...props}>
    <path
      fill='currentColor'
      d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    />
  </Icon>
)

function UserDmMenu(props: {
  user: TableUser,
  user2: User,
  reload: any,
  setReload: any
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const me: User = userStorage.getUser() || emptyUser();
  const toast = useToast();
  let navigate = useNavigate();

  async function blockUser() {
    const response: any = await channelApi.blockUser(me.id, props.user.id);
    const status = response.status == 201 ? 'success' : 'error';
    const message = response.status == 201 ? '' : response.data.message;
    toast({
      title: 'User block request sent',
      status: status,
      description: message,
    })
    await userStorage.updateUser();
    props.setReload(!props.reload);
  }

  async function unblockUser() {
    const response: any = await channelApi.unblockUser(me.id, props.user.id);
    const status = response.status == 200 ? 'success' : 'error';
    const message = response.status == 200 ? '' : response.data.message;
    toast({
      title: 'User unblock request sent',
      status: status,
      description: message,
    })
    await userStorage.updateUser();
    props.setReload(!props.reload);
  }

  async function removeFriend() {
    const response: any = await userApi.removeFriend(me.id, props.user.id);
    const status = response.status == 200 ? 'success' : 'error';
    const message = response.status == 200 ? '' : response.data.message;
    toast({
      title: 'Friend removal request sent',
      status: status,
      description: message,
    })
    if (response.status == 200) {
      me.friends.splice(me.friends.findIndex(i => i.id == props.user.id), 1);
      await userStorage.saveUser(me);
      props.setReload(!props.reload);
    }
  }

  const isMyself = me.id == props.user.id;
  const isBlocked = me.blocked.find((user) => props.user.id == user.id);
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
        isOpen={isOpen}
        onClose={onClose}
      ></PublicProfile>
      <Menu isLazy>
        <CircleIcon color={color}></CircleIcon>
        <MenuButton>
          {props.user.nickname}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={onOpen}>view profile</MenuItem>
          <MenuItem onClick={() => navigate(`/dm?user=${props.user.id}`)}>
            send message
          </MenuItem>
          <MenuItem>invite to game</MenuItem>
          <MenuItem onClick={removeFriend}>remove friend</MenuItem>
          {
            isMyself
              ? null
              : (
                isBlocked
                  ? <MenuItem onClick={unblockUser}>unblock user</MenuItem>
                  : <MenuItem onClick={blockUser}>block user</MenuItem>
              )
          }
        </MenuList>
      </Menu>
    </Box>
  );
}

function PendingRequestMenu(props: {
  user: TableUser,
  user2: User,
  reload: any,
  setReload: any,
}) {
  const me: User = userStorage.getUser() || emptyUser();

  function updateMe() {
    me.friend_requests.splice(
      me.friend_requests.findIndex(user => user.id == props.user.id), 1
    )
    userStorage.saveUser(me);
  }

  async function acceptFriend() {
    const response: any = await userApi.acceptFriend(me.id, props.user.id);
    if (response.status < 400) {
      me.friends.push(props.user2);
      updateMe();
      props.setReload(!props.reload)
    }
  }

  async function rejectFriend() {
    const response: any = await userApi.rejectFriend(me.id, props.user.id);
    if (response.status < 400) {
      updateMe();
      props.setReload(!props.reload)
    }
  }


  return (
    <Box padding={1}>
      <Text>{props.user.nickname}</Text>
      <CheckIcon
        onClick={acceptFriend}
        color={'green.500'}
        marginRight={'10px'}
      ></CheckIcon>
      <CloseIcon
        onClick={rejectFriend}
        color={'red.500'}
        boxSize={'0.8em'}
      ></CloseIcon>
    </Box>
  )
}

export function DmUsers(props: {
  users: User[],
  requests: User[]
}) {
  const [reload, setReload] = useState<boolean>(false);
  const me = userStorage.getUser() || emptyUser();

  const userList = me.friends.map((user: User, i: number) => {
    const tableuser = TableUser(user);
    return (
      <UserDmMenu
        key={i}
        user={tableuser}
        user2={user}
        reload={reload}
        setReload={setReload}
    ></UserDmMenu>
    );
  });
  const requestList = me.friend_requests.map((user: User, i: number) => {
    const tableuser = TableUser(user);
    return <PendingRequestMenu
      key={i}
      user={tableuser}
      user2={user}
      reload={reload}
      setReload={setReload}
    />
  })
  return (
    <>
      <Text> Friends</Text>
      <hr></hr>
      {userList}
      <br></br>
      <Text>Friend Requests</Text>
      <hr></hr>
      {requestList}
    </>
  );
}
