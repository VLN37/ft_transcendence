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
import { iDirectMessage } from '../../models/DirectMessage';
import { api, chatApi, userApi } from '../../services/api_index';
import userStorage from '../../services/userStorage';
import { DmUsers } from '../Chat/DmUsers';

function ChatTitle(props: any) {
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
          <div dangerouslySetInnerHTML={{ __html: props.text }} />
        </Text>
      </Flex>
    </Flex>
  );
}

function InputMessage(props: any) {
  const keyEnter = (event: any) => {
    if (event.key == 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(props.to);
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
            onClick={() => sendMessage(props.to)}
          />
        </Box>
      </Flex>
    </>
  );
}

function sendMessage(to: string) {
  const text = (document.getElementById('message') as HTMLInputElement).value;
  (document.getElementById('message') as HTMLInputElement).value = '';
  // chatApi.setChannelSocket(api);
  chatApi.sendDirectMessage({ message: text, user_id: to });
  console.log('message sent');
}

export default function DirectMessage(props: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<iDirectMessage[]>([]);
  const [chatTitle, setChatTitle] = useState('');
  const userId = searchParams.get('user') || '';
  const myId = userStorage.getUser()?.id;
  userApi.getUser(userId).then((user) => {
    setChatTitle(user.profile.nickname);
  });

  const updateMessages = (message: iDirectMessage) => {
    if (message.sender.id.toString() == userId || message.sender.id == myId)
      setMessages([...messages, message]);
  };

  useEffect(() => {
    chatApi.subscribeDirectMessage(updateMessages);
    return () => chatApi.unsubscribeDirectMessage(updateMessages);
  }, [messages]);

  useEffect(() => {
    async function fetchUser() {
      await userStorage.updateUser();
    }
    fetchUser();
    chatApi.getDirectMessages(userId).then((messages: iDirectMessage[]) => {
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
        <ChatTitle>{chatTitle}</ChatTitle>
      </GridItem>
      <GridItem borderRadius={'5px'} rowSpan={11} colSpan={2} bg="gray.700">
        <DmUsers
          users={userStorage.getUser()?.friends || []}
          requests={userStorage.getUser()?.friend_requests || []}
        />
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
              name={message.sender.profile.nickname}
              image={
                process.env.REACT_APP_BACK_HOSTNAME +
                message.sender.profile.avatar_path
              }
              text={message.message}
              key={message.id}
            />
          );
        })}
        <Spacer id="bottom" />
      </GridItem>
      <GridItem borderRadius={'5px'} rowSpan={2} colSpan={8} bg="gray.700">
        <InputMessage to={userId} placeholder={`Message ${chatTitle}`} />
      </GridItem>
    </Grid>
  );
}
