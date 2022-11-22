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
import { Channel } from '../../models/Channel';
import { Message } from '../../models/Message';
import api from '../../services/api';

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

// id: number;
// message: string;
// user: User;
// channel: Channel;

function sendMessage(room_id: string) {
  const text = (document.getElementById('message') as HTMLInputElement).value;
  (document.getElementById('message') as HTMLInputElement).value = '';
  api.sendMessage({ message: text, channel_id: room_id });
  console.log('message sent');
}

export default function Chat(props: Channel) {
  const [messages, setMessages] = useState<Message[]>([]);

  api.listenMessage((message: Message) => {
    setMessages([...messages, message]);
    console.log('message received');
  });

  useEffect(() => {
    api.getChannelMessages(props.id.toString()).then((messages: Message[]) => {
      setMessages(messages);
    });
  }, []);

  useEffect(() => {
    document.getElementById('bottom')?.scrollIntoView();
  }, [messages]);

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
