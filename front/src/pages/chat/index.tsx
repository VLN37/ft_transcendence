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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import io from 'socket.io-client';

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
    <>
      <h1>USERS1</h1>
      <h1>USERS2</h1>
    </>
  );
}

function InputMessage() {
  return (
    <>
      <Flex alignItems={'center'}>
        <Textarea
          id="message"
          size={'lg'}
          padding={'1rem'}
          placeholder="Here is a sample placeholder"
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
    <Container maxW="1200px" maxHeight={'80vh'}>
      <Center paddingY={'0.5rem'} color="white">
        <Text fontSize="3xl">{'CHANNEL #' + searchParams.get('id')}</Text>
      </Center>
      <Grid
        templateAreas={`"friends" "content" "send"`}
        h="70vh"
        templateRows="repeat(6, 1fr)"
        templateColumns="repeat(6, 1fr)"
        gap={5}
      >
        <GridItem colSpan={1} rowSpan={6} bg="gray.700" borderRadius={'5px'}>
          <Users />
        </GridItem>
        <GridItem
          colSpan={5}
          rowSpan={5}
          bg="gray.700"
          overflowY={'scroll'}
          borderRadius={'5px'}
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
          <div id="bottom" />
        </GridItem>
        <GridItem colSpan={5} rowSpan={1} bg="gray.700" borderRadius={'5px'}>
          <InputMessage />
        </GridItem>
      </Grid>
    </Container>
  );
}
