import { CheckIcon, CloseIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TableUser } from '../../models/TableUser';
import { emptyUser, User } from '../../models/User';
import { channelApi, chatApi, mmApi, userApi } from '../../services/api_index';
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

function UserDmMenu(props: {
  user: TableUser,
  user2: User,
  me: User,
  setMe: any
}) {
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
  const toast = useToast();
  let navigate = useNavigate();

  async function blockUser() {
    const response: any = await channelApi.blockUser(
      props.me.id, props.user.id
    );
	if (!response) return;
    const status = response.status == 201 ? 'success' : 'error';
    const message = response.status == 201 ? '' : response.data.message;
    toast({
      title: 'User block request sent',
      status: status,
      description: message,
    })
    // await userStorage.updateUser();
    props.me.blocked.push(props.user2);
    userStorage.saveUser(props.me);
    props.setMe({... props.me});
  }

  async function unblockUser() {
    const resp: any = await channelApi.unblockUser(props.me.id, props.user.id);
    const status = resp.status == 200 ? 'success' : 'error';
    const message = resp.status == 200 ? '' : resp.data.message;
    toast({
      title: 'User unblock request sent',
      status: status,
      description: message,
    })
    if (resp.status == 200) {
      const update = await userStorage.updateUser();
      props.setMe({... update});
    }
  }

  async function removeFriend() {
    const resp: any = await userApi.removeFriend(props.me.id, props.user.id);
    const status = resp.status == 200 ? 'success' : 'error';
    const message = resp.status == 200 ? '' : resp.data.message;
    toast({
      title: 'Friend removal request sent',
      status: status,
      description: message,
    })
    if (resp.status == 200) {
      const index = props.me.friends.findIndex(elem => elem.id == props.me.id);
      props.me.friends.splice(index, 1);
      userStorage.saveUser(props.me);
      props.setMe({... props.me});
    }
  }

  async function gameInvite() {
    const response: any = await mmApi.sendGameRequest(props.me, props.user.id);
	if (!response) return;
    const status = response.status == 201 ? 'success' : 'error';
    const message = response.status == 201 ? '' : response.data.message;
    toast({
      title: 'Game request sent',
      status: status,
      description: message,
    });
  }

  const isMyself = props.me.id == props.user.id;
  const isBlocked = props.me.blocked.find((user) => props.user.id == user.id);
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
        <CircleIcon color={color}></CircleIcon>
        {isBlocked ? <ViewOffIcon></ViewOffIcon> : null}
        <MenuButton
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          _hover={{ bg: 'blue.700' }}
          _expanded={{ bg: 'blue.400' }}
          _focus={{ boxShadow: 'outline' }}
        >
          {props.user.nickname}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={openProfile}>view profile</MenuItem>
          <MenuItem onClick={openHistory}>view match history</MenuItem>
          <MenuItem onClick={() => navigate(`/dm?user=${props.user.id}`)}>
            send message
          </MenuItem>
          <MenuItem onClick={gameInvite}>invite to game</MenuItem>
          <MenuItem onClick={removeFriend}>remove friend</MenuItem>
          {isMyself ? null : isBlocked ? (
            <MenuItem onClick={unblockUser}>unblock user</MenuItem>
          ) : (
            <MenuItem onClick={blockUser}>block user</MenuItem>
          )}
        </MenuList>
      </Menu>
    </Box>
  );
}

function PendingRequestMenu(props: {
  user: TableUser,
  user2: User,
  me: User,
  setMe: any,
}) {
  // const me: User = userStorage.getUser() || emptyUser();

  async function updateMe() {
    // console.log(props.me);
    props.me.friend_requests.splice(
      props.me.friend_requests.findIndex(elem => elem.id == props.user.id), 1
    )
    userStorage.saveUser(props.me);
    props.setMe({... props.me})
    // await userStorage.updateUser();
  }

  async function acceptFriend() {
    const resp: any = await userApi.acceptFriend(props.me.id, props.user.id);
    if (resp.status < 400) {
      props.me.friends.push(props.user2);
      await updateMe();
    }
  }

  async function rejectFriend() {
    const resp: any = await userApi.rejectFriend(props.me.id, props.user.id);
    if (resp.status < 400) {
      await updateMe();
    }
  }

  return (
    <Flex
      padding={1}
      direction={'row'}
      width={'100%'}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <Text>{props.user.nickname}</Text>
      <Box>
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
    </Flex>
  )
}

export function DmUsers() {
  const [me, setMe] = useState<User>(userStorage.getUser() || emptyUser());

  const toast = useToast();
  const navigate = useNavigate();
  async function updateFriends(data: any) {
    if (data.status == 'REQUEST') {
      if (!me.friend_requests.find((elem) => elem.id == data.user.id))
      me.friend_requests.push(data.user);
    }
    else if (data.status == 'ACCEPTED') {
      const index = me.friend_requests.findIndex((e) => e.id == data.user.id);
      if (index != -1) me.friend_requests.splice(index, 1);
      me.friends.push(data.user);
    }
    else if (data.status == 'REMOVED') {
      const index = me.friends.findIndex(e => e.id == data.user.id);
      if (index != -1) me.friends.splice(index, 1);
      toast({
        title: `${data.user.login_intra} removed you from his friend list`,
        status: 'info',
        description: ':(',
      })
    }
    userStorage.saveUser(me);
    setMe({... me});
  }

  async function updateStatus (data: any){
    const index = me.friends.findIndex(elem => elem.id == data.user.id);
    if (index == -1)
      return;
    me.friends[index].profile.status = data.user.profile.status;
    setMe({... me});
  }

  useEffect(() => {
    async function fetchUser() {
      const user = await userApi.getMe();
      if (!user.id) {
        toast ({
          title: 'Authentication invalid',
          status: 'warning',
          description: 'please relog',
        });
        navigate('/login');
      }
      userStorage.saveUser(user);
      setMe({...user});
    }
    fetchUser();
    chatApi.subscribeFriendRequest(updateFriends);
    chatApi.subscribeUserStatus(updateStatus);
    return () => {
      chatApi.unsubscribeFriendRequest()
      chatApi.unsubscribeUserStatus();
    };
  }, []);

  const userList = me.friends.map((user: User, i: number) => {
    const tableuser = TableUser(user);
    return (
      <UserDmMenu
        key={i}
        user={tableuser}
        user2={user}
        me={me}
        setMe={setMe}
    ></UserDmMenu>
    );
  });

  const requestList = me.friend_requests.map((user: User, i: number) => {
    const tableuser = TableUser(user);
    return <PendingRequestMenu
      key={i}
      user={tableuser}
      user2={user}
      me={me}
      setMe={setMe}
    />
  })

  return (
    <>
      <Text as={'b'} paddingLeft={1}>Friends</Text>
      <hr></hr>
      {userList}
      <br></br>
      <Text as={'b'} paddingLeft={1}>Friend Requests</Text>
      <hr></hr>
      {requestList}
    </>
  );

}
