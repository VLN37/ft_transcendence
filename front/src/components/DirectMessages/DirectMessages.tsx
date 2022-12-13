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
import { iDirectLastMessage } from '../../models/DirectMessages';
import { chatApi } from '../../services/api_index';
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
  const [messages, setMessages] = useState<iDirectLastMessage[]>([]);

  useEffect(() => {
    async function fetchUser() {
      await userStorage.updateUser();
    }

    chatApi.subscribeDirectMessage((message: iDirectMessage) => {
      chatApi
        .getLastDirectMessages()
        .then((dm_messages: iDirectLastMessage[]) => {
          setMessages(dm_messages);
        });
    });

    chatApi
      .getLastDirectMessages()
      .then((dm_messages: iDirectLastMessage[]) => {
        setMessages(dm_messages);
        fetchUser();
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
        <DmUsers
          users={userStorage.getUser()?.friends || []}
          requests={userStorage.getUser()?.friend_requests || []}
        />
      </GridItem>
      <GridItem
        borderRadius={'5px'}
        rowSpan={12}
        colSpan={8}
        overflowY={'scroll'}
      >
        {messages.map((message, index) => {
          return (
            <MessageBoxComponent
              user_id={message.subject.id}
              name={message.subject.profile.nickname}
              image={
                process.env.REACT_APP_BACK_HOSTNAME +
                message.subject.profile.avatar_path
              }
              text={message.message}
              key={index}
            />
          );
        })}
      </GridItem>
    </Grid>
  );
}
