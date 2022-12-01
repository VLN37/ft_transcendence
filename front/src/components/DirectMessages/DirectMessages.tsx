import {
  Avatar,
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { iDirectMessage } from '../../models/DirectMessage';
import { User } from '../../models/User';
import api from '../../services/api';
import userStorage from '../../services/userStorage';
import { DmUsers } from '../Chat/DmUsers';

function ChatTitle(props: any) {
  return (
    <Center color="white">
      <Text fontSize="3xl">{props.children}</Text>
    </Center>
  );
}

function MessageBoxComponent(props: any) {
  return (
    <Link to={`/dm?user=${props.user_id}`}>
      <Flex
        bg="gray.700"
        marginBottom={'1rem'}
        paddingY={'1rem'}
        alignItems={'flex-start'}
      >
        <Box paddingX={'1rem'}>
          <Avatar
            showBorder
            borderColor={'green.500'}
            borderRadius={'5px'}
            size={'md'}
            src={props.image}
          />
          <Text paddingTop={'0.1rem'} fontWeight={'bold'} align={'center'}>
            {props.name}
          </Text>
        </Box>
        <Flex paddingRight={'1rem'} alignItems={'center'}>
          <Text fontSize="lg" wordBreak={'break-word'} paddingX={'0.2rem'}>
            {props.text}
          </Text>
        </Flex>
      </Flex>
    </Link>
  );
}

export default function DirectMessagesComponent(props: any) {
  const [users, setUsers] = useState<User[]>([]);

  api.subscribeDirectMessage((message: iDirectMessage) => {
    api.getLastDirectMessages().then((dm_users: User[]) => {
      setUsers(dm_users);
    });
  });

  useEffect(() => {
    api.getLastDirectMessages().then((dm_users: User[]) => {
      setUsers(dm_users);
    });
  }, []);

  return (
    <Grid
      gridTemplateColumns={'repeat(10, 1fr)'}
      gridTemplateRows={'repeat(12, 1fr)'}
      gridColumnGap={'10px'}
      gridRowGap={'10px'}
      h={'100%'}
    >
      <GridItem borderRadius={'5px'} rowSpan={1} colSpan={10}>
        <ChatTitle>Direct Messages</ChatTitle>
      </GridItem>
      <GridItem borderRadius={'5px'} rowSpan={12} colSpan={2} bg="gray.700">
        <DmUsers users={userStorage.getUser()?.friends || []} />
      </GridItem>
      <GridItem
        borderRadius={'5px'}
        rowSpan={12}
        colSpan={8}
        overflowY={'scroll'}
      >
        {users.map((user, index) => {
          return (
            <MessageBoxComponent
              user_id={user.id}
              name={user.profile.nickname}
              image={process.env.REACT_APP_HOSTNAME + user.profile.avatar_path}
              text={''}
              key={index}
            />
          );
        })}
      </GridItem>
    </Grid>
  );
}
