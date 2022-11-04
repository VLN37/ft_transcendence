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
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import userStorage from '../../services/userStorage';

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
      <Flex paddingRight={'1rem'} paddingTop={'0.7rem'} alignItems={'center'}>
        <Text wordBreak={'break-word'} padding={'0.2rem'} mt={'-1rem'}>
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
            onClick={() => sendMessage()}
          />
        </Box>
      </Flex>
    </>
  );
}

interface Message {
  id: string;
  name: string;
  text: string;
  room: string;
  avatar: string;
}

function sendMessage() {
  const params = new URLSearchParams(window.location.search);
  const room = params.get('id') || '';
  const text = (document.getElementById('message') as HTMLInputElement).value;
  (document.getElementById('message') as HTMLInputElement).value = '';
  const message: Message = {
    id: userStorage.getUser()?.id?.toString() || '',
    name: userStorage.getUser()?.profile?.nickname || '',
    text: text,
    room: room,
    avatar: userStorage.getUser()?.profile?.avatar_path || '',
  };
  api.sendMessage(message);
  console.log('message sent');
}

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);

  api.listenMessage((message: Message) => {
    const newMessage: Message = {
      id: message.id,
      name: message.name,
      text: message.text,
      room: message.room,
      avatar: message.avatar,
    };
    setMessages([...messages, newMessage]);
    console.log('message received');
  });

  useEffect(() => {
    document.getElementById('bottom')?.scrollIntoView();
  }, [messages, searchParams]);

  return (
    <Grid
      gridTemplateColumns={'repeat(10, 1fr)'}
      gridTemplateRows={'repeat(12, 1fr)'}
      gridColumnGap={'10px'}
      gridRowGap={'10px'}
      h={'100%'}
    >
      <GridItem borderRadius={'5px'} rowSpan={1} colSpan={10}>
        <ChannelTitle>{'CHANNEL #' + searchParams.get('id')}</ChannelTitle>
      </GridItem>
      <GridItem borderRadius={'5px'} rowSpan={11} colSpan={2} bg="gray.700">
        <Users />
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
              name={message.name}
              image={message.avatar}
              text={message.text}
            />
          );
        })}
        <Spacer id="bottom" />
      </GridItem>
      <GridItem borderRadius={'5px'} rowSpan={2} colSpan={8} bg="gray.700">
        <InputMessage
          placeholder={'Message CHANNEL #' + searchParams.get('id')}
        />
      </GridItem>
    </Grid>
  );
}
