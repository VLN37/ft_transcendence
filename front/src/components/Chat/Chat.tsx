import { ArrowRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Text,
  Textarea,
  IconButton,
  Spacer,
  Avatar,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { Channel } from '../../models/Channel';
import { Message } from '../../models/Message';
import { User } from '../../models/User';
import api from '../../services/api';
import userStorage from '../../services/userStorage';
import { ChatUsers } from './ChatUsers';

function ChannelTitle(props: any) {
  return (
    <Center color="white">
      <Text fontSize="3xl">{props.children}</Text>
    </Center>
  );
}

function MessageComponent(props: any) {
  return (
    <Flex paddingY={'1rem'} alignItems={'flex-start'}>
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
        <Text wordBreak={'break-word'} paddingX={'0.2rem'}>
          {props.text}
        </Text>
      </Flex>
    </Flex>
  );
}

function Users() {
  return (
    <Box padding={2}>
      <h1>USERS1</h1>
      <h1>USERS2</h1>
    </Box>
  );
}

function InputMessage(props: any) {
  return (
    <>
      <Flex h={'100%'} alignItems={'center'}>
        <Textarea
          id="message"
          size={'lg'}
          padding={'1rem'}
          marginX={'0.5rem'}
          placeholder={props.placeholder}
        />
        <Box padding={'1rem'}>
          <IconButton
            aria-label="Send message"
            icon={<ArrowRightIcon />}
            onClick={() => sendMessage(props.room)}
          />
        </Box>
      </Flex>
    </>
  );
}

function sendMessage(room_id: string) {
  const text = (document.getElementById('message') as HTMLInputElement).value;
  (document.getElementById('message') as HTMLInputElement).value = '';
  api.sendMessage({ message: text, channel_id: room_id });
  console.log('message sent');
}

export default function Chat(props: Channel) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [channel, setChannel] = useState<Channel>(props);
  const [reload, setReload] = useState<Boolean>(false);

  const updateMessages = useCallback(
    (message: Message) => setMessages([...messages, message]),
    [messages],
  );

  const updateChannel = useCallback(
    (data: any) => {
      if (!channel.users.find((elem) => elem.id == data.user.id)) {
        console.log('user joined');
        channel.users.push(data.user);
        setChannel(channel);
        setReload(!reload);
      }
    },
    [channel],
  );

  useEffect(() => {
    api.subscribeJoin(updateChannel);
    return () => api.unsubscribeJoin(updateChannel);
  }, [channel]);

  useEffect(() => {
    api.subscribeMessage(updateMessages);
    return () => api.unsubscribeMessage(updateMessages);
  }, [messages]);

  useEffect(() => {
    api.getChannelMessages(props.id.toString()).then((messages: Message[]) => {
      setMessages(messages);
    });
  }, []);

  useEffect(() => {
    document.getElementById('bottom')?.scrollIntoView();
  }, [messages]);

  // console.log('chat page: ', props);
  return (
    <Grid
      gridTemplateColumns={'repeat(10, 1fr)'}
      gridTemplateRows={'repeat(12, 1fr)'}
      gridColumnGap={'10px'}
      gridRowGap={'10px'}
      h={'100%'}
    >
      <GridItem borderRadius={'5px'} rowSpan={1} colSpan={10}>
        <ChannelTitle>{`${props.name} #${props.id}`}</ChannelTitle>
      </GridItem>
      <GridItem borderRadius={'5px'} rowSpan={11} colSpan={2} bg="gray.700">
        {props.users ? <ChatUsers channel={channel} /> : null}
      </GridItem>
      <GridItem
        borderRadius={'5px'}
        rowSpan={9}
        colSpan={8}
        bg="gray.700"
        overflowY={'scroll'}
      >
        {messages.map((message) => {
          return (
            <MessageComponent
              name={message.user.profile.nickname}
              image={
                process.env.REACT_APP_HOSTNAME +
                message.user.profile.avatar_path
              }
              text={message.message}
              key={message.id}
            />
          );
        })}
        <Spacer id="bottom" />
      </GridItem>
      <GridItem borderRadius={'5px'} rowSpan={2} colSpan={8} bg="gray.700">
        <InputMessage room={props.id} placeholder={`Message ${props.name}`} />
      </GridItem>
    </Grid>
  );
}
