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
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Channel } from '../../models/Channel';
import { Message } from '../../models/Message';
import { chatApi } from '../../services/api_index';
import userStorage from '../../services/userStorage';
import { ChatSettings } from './ChatSettings';
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

function InputMessage(props: any) {
  const keyEnter = (event: any) => {
    if (event.key == 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(props.room);
    }
  };
  return (
    <>
      <Flex h={'100%'} alignItems={'center'}>
        <Textarea
          id="message"
          size={'lg'}
          padding={'1rem'}
          marginX={'0.5rem'}
          placeholder={props.placeholder}
          onKeyDown={keyEnter}
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
  if (!text) return;
  (document.getElementById('message') as HTMLInputElement).value = '';
  chatApi.sendMessage({ message: text, channel_id: room_id });
  console.log('message sent');
}

export default function Chat(props: Channel) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [channel, setChannel] = useState<Channel>(props);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const myId: number = userStorage.getUser()?.id || 0;
  const toast = useToast();
  let navigate = useNavigate();

  const updateMessages = (message: Message) =>
    setMessages([...messages, message]);

  const addUserChannelList = (data: any) => {
    if (!channel.users.find((elem) => elem.id == data.user.id)) {
      console.log('user joined');
      channel.users.push(data.user);
      setChannel({ ...channel });
    }
  };

  const delUserChannelList = (data: any) => {
    if (channel.users.find((elem) => elem.id == data.user.id)) {
      console.log('user leave');
      const index = channel.users.findIndex((elem) => elem.id == data.user.id);
      channel.users.splice(index, 1);
      setChannel({ ...channel });
    }
  };

  useEffect(() => {
    chatApi.subscribeChannelDisconnect(() => {
      toast({
        title: `Disconnected from the channel ${channel.name}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/community');
    });

    chatApi
      .getChannelMessages(props.id.toString())
      .then((messages: Message[]) => {
        setMessages(messages);
      });

    chatApi.subscribeJoin(addUserChannelList);

    chatApi.subscribeLeave((data: any) => {
      if (data.user.id == myId) chatApi.disconnect();
      else delUserChannelList(data);
      chatApi.getChannel(channel.id.toString()).then((channel: Channel) => {
        setChannel(channel);
      });
    });

    return () => {
      chatApi.unsubscribeChannelDisconnect();
      chatApi.unsubscribeJoin();
      chatApi.unsubscribeLeave(delUserChannelList);
    };
  }, []);

  useEffect(() => {
    chatApi.subscribeMessage(updateMessages);
    document.getElementById('bottom')?.scrollIntoView();
    return () => chatApi.unsubscribeMessage(updateMessages);
  }, [messages]);

  return (
    <Grid
      gridTemplateColumns={'repeat(10, 1fr)'}
      gridTemplateRows={'repeat(12, 1fr)'}
      gridColumnGap={'10px'}
      gridRowGap={'10px'}
      h={'100%'}
    >
      <GridItem borderRadius={'5px'} rowSpan={1} colSpan={9}>
        <ChannelTitle>{`${props.name} #${props.id}`}</ChannelTitle>
      </GridItem>
      <GridItem colStart={10}>
        {myId == props.owner_id && props.type != 'PRIVATE' ? (
          <ChatSettings setChannel={setChannel} channel={props}></ChatSettings>
        ) : null}
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
          message.message = message.message.replaceAll('\n', '<br/>');
          return (
            <MessageComponent
              name={message.user.profile.nickname}
              image={
                process.env.REACT_APP_BACK_HOSTNAME +
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
