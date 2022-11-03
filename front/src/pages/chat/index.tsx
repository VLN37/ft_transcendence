import { ArrowRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Text,
  Textarea,
  Image,
  IconButton,
  Spacer,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import io from 'socket.io-client';

function ChannelTitle(props: any) {
  return (
    <Center paddingY={'0.5rem'} color="white">
      <Text fontSize="3xl">{props.children}</Text>
    </Center>
  );
}

function MessageComponent(props: any) {
  return (
    <Flex>
      <Box padding={'1rem'}>
        <Image
          border={'2px'}
          borderColor={'green.500'}
          borderRadius="5px"
          boxSize={'80px'}
          src={props.image}
          alt={props.name}
        />
        <Text paddingTop={'0.1rem'} fontWeight={'bold'} align={'center'}>
          {props.name}
        </Text>
      </Box>
      <Flex alignItems={'center'}>
        <Text padding={'0.2rem'} mt={'-1rem'}>
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

const socket = io('http://localhost:3000');

interface Message {
  id: string;
  name: string;
  text: string;
}

interface Payload {
  name: string;
  text: string;
}

function sendMessage() {
  socket.emit('createRoom', 1);
  const text = (document.getElementById('message') as HTMLInputElement).value;
  (document.getElementById('message') as HTMLInputElement).value = '';
  const message: Payload = {
    name: 'namae',
    text: text,
  };
  socket.emit('mensagem', message);
  console.log('message sent');
}

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);

  socket.on('createRoom', (data) => {
    console.log('Message from room: ' + data);
  });

  socket.on('mensagem', (message: Message) => {
    const newMessage: Message = {
      id: message.id,
      name: message.name,
      text: message.text,
    };
    setMessages([...messages, newMessage]);
    console.log('message received');
  });

  useEffect(() => {
    document.getElementById('bottom')?.scrollIntoView();
  }, [messages, searchParams]);

  return (
    <Container maxW="1200px" h={'80vh'} maxHeight={'80vh'}>
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
                image={'https://bit.ly/dan-abramov'}
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
    </Container>
  );
}
