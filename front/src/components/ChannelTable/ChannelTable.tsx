import { LockIcon, RepeatIcon, UnlockIcon } from '@chakra-ui/icons';
import {
  TableContainer,
  Input,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Select,
  FormControl,
  FormLabel,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { useState, useEffect, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { User, emptyUser } from '../../models/User';
import { chatApi } from '../../services/api_index';
import { Channel } from '../../models/Channel';
import { channelApi, api } from '../../services/api_index';
import userStorage from '../../services/userStorage';
import { StatusCodes } from 'http-status-codes';
import { ChannelStatus } from '../../services/ChatApi';

function formatValues(values: any) {
  if (values.hasOwnProperty('allowed_users')) {
    let users: string[] = values.allowed_users.split(',');
    users = users.map((user_channel) => user_channel.trim());
    values.allowed_users = users;
  }
  if (values.type == 'PUBLIC') {
    delete values.password;
    delete values.allowed_users;
  }
  if (values.type == 'PROTECTED') delete values.allowed_users;
  if (values.type == 'PRIVATE') delete values.password;
  return values;
}

function CreateChannel() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [option, setOption] = useState('');
  const toast = useToast();
  let navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values: any) {
    const user: User = userStorage.getUser() || emptyUser();
    values.owner_id = user.id;
    values = formatValues(values);
    api.createChannel(values).then((response) => {
      onClose();
      if (!response || response.status != 201) {
        toast({
          title: 'Failed to create channel',
          description: response?.data?.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Channel created',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        api
          .connectToChannel({
            room: response.data.id,
            password: values.password,
          })
          .then((res) => {
            chatApi.setChannelSocket(api);
            if (res.status == StatusCodes.OK) {
              channelApi
                .getChannel(response.data.id.toString())
                .then((channel: Channel) => {
                  navigate('/chat', { state: { ...channel } });
                });
            } else {
              toast({
                title: 'Failed to join channel',
                description: res.message,
                status: 'error',
                duration: 2000,
                isClosable: true,
              });
            }
          });
      }
    });
  }

  return (
    <>
      <Button onClick={onOpen}>Create channel</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader textAlign={'center'}>Create new channel</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>name</FormLabel>
                <Input
                  id="name"
                  {...register('name', { required: 'This is required' })}
                  placeholder="example: My Channel"
                  type="text"
                  mb={'1rem'}
                />
                <FormLabel>type</FormLabel>
                <Select
                  id="type"
                  {...register('type', { required: 'This is required' })}
                  placeholder="Select option"
                  mb={'1rem'}
                  onChange={(option) => {
                    setOption(option.target.value);
                  }}
                >
                  <option value="PUBLIC">PUBLIC</option>
                  <option value="PRIVATE">PRIVATE</option>
                  <option value="PROTECTED">PROTECTED</option>
                </Select>
                {option == 'PRIVATE' && (
                  <>
                    <FormLabel>users</FormLabel>
                    <Input
                      id="allowed_users"
                      {...register('allowed_users', {
                        required: 'This is required',
                      })}
                      type="text"
                      placeholder="example: jofelipe, psergio-, wleite"
                    />
                  </>
                )}
                {option == 'PROTECTED' && (
                  <>
                    <FormLabel>password</FormLabel>
                    <Input
                      id="password"
                      {...register('password', {
                        required: 'This is required',
                      })}
                      isRequired
                      type="password"
                    />
                  </>
                )}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button isLoading={isSubmitting} colorScheme="blue" type="submit">
                create
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}

function AskPassword(channel: Channel) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  let navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  function onSubmit(values: any) {
    const password: string = values.password || '';
    api.connectToChannel({ room: channel.id, password }).then((res) => {
      chatApi.setChannelSocket(api);
      if (res.status == StatusCodes.OK) {
        channelApi
          .getChannel(channel.id.toString())
          .then((channel: Channel) => {
            navigate('/chat', { state: { ...channel } });
          });
      } else {
        toast({
          title: 'Failed to join channel',
          description: res.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    });
    onClose();
  }

  return (
    <>
      <Button onClick={onOpen} colorScheme={'blue'}>
        join
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader
              textAlign={'center'}
            >{`Join ${channel.name}`}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>password</FormLabel>
                <Input
                  id="password"
                  {...register('password', {
                    required: 'This is required',
                  })}
                  isRequired
                  type="password"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button isLoading={isSubmitting} colorScheme="blue" type="submit">
                join
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}

export function ChannelTable() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [bkpChannels, setBkpChannels] = useState<Channel[]>([]);
  const toast = useToast();
  let navigate = useNavigate();
  const user = userStorage.getUser() || emptyUser();
  const [reload, setReload] = useState<boolean>(false);

  const isMember = (channel: Channel) => {
    return user?.channels.find((channel_user) => channel_user.id == channel.id);
  };

  async function leaveChannel(channel_id: number) {
    const response = await chatApi.leave(channel_id);
    if (!response || response.status != StatusCodes.OK) {
      toast({
        title: 'Failed to leave channel',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setChannels((prevChannels) =>
      prevChannels.map((chn) => {
        if (chn.id == channel_id)
          chn.users = chn.users.filter((prevUser) => prevUser.id != user.id);
        return chn;
      }),
    );
  }

  const join = (channel: Channel) => {
    api.connectToChannel({ room: channel.id }).then((res) => {
      chatApi.setChannelSocket(api);
      if (res.status == StatusCodes.OK) {
        channelApi
          .getChannel(channel.id.toString())
          .then((channel: Channel) => {
            navigate('/chat', { state: { ...channel } });
          });
      } else {
        toast({
          title: 'Failed to join channel',
          description: res.message,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    });
  };

  const filterChannel = (event: ChangeEvent<HTMLInputElement>) => {
    const filter = event.target.value;
    const filteredChannels = bkpChannels.filter((channel) =>
      channel.name.toLowerCase().includes(filter.toLocaleLowerCase()),
    );
    setChannels(filteredChannels);
  };

  useEffect(() => {
    chatApi.subscribeChannelStatus((channelStatus: ChannelStatus) => {
      if (channelStatus.event == 'created')
        setChannels((prevChannels) => [channelStatus.channel, ...prevChannels]);
      if (channelStatus.event == 'updated') {
        setChannels((prevChannels) =>
          prevChannels.map((chn) => {
            if (chn.id == channelStatus.channel.id)
              chn = { ...channelStatus.channel };
            return chn;
          }),
        );
      }
      if (channelStatus.event == 'delete') {
        setChannels((prevChannels) =>
          prevChannels.filter((chn) => chn.id != channelStatus.channel.id),
        );
      }
    });

    return () => chatApi.unsubscribeChannelStatus();
  }, []);

  useEffect(() => {
    channelApi.getChannels().then((channels) => {
      setChannels(channels);
      setBkpChannels(channels);
    });
  }, [reload]);

  return (
    <>
      <HStack>
        <Input onChange={filterChannel} placeholder="Search channel room" />
        <IconButton
          onClick={() => setReload(!reload)}
          aria-label="Refresh channel list"
          icon={<RepeatIcon />}
        />
        <CreateChannel />
      </HStack>
      <TableContainer
        overflowY={'scroll'}
        h={'100%'}
        maxHeight={'100%'}
        paddingBottom={'2rem'}
      >
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>chat room</Th>
              <Th>type</Th>
              <Th>password</Th>
              <Th>owner</Th>
            </Tr>
          </Thead>
          <Tbody>
            {channels.map((channel) => {
              return (
                <Tr key={channel.id}>
                  <Td>{channel.name}</Td>
                  <Td>{channel.type}</Td>
                  <Td>
                    {channel.type == 'PROTECTED' ? (
                      <LockIcon boxSize={'2rem'} />
                    ) : (
                      <UnlockIcon boxSize={'2rem'} />
                    )}
                  </Td>
                  <Td>{channel.owner_id}</Td>
                  <Td>
                    <Button
                      onClick={() => leaveChannel(channel.id)}
                      visibility={isMember(channel) ? 'visible' : 'hidden'}
                      marginRight={'2rem'}
                      colorScheme={'red'}
                    >
                      leave
                    </Button>
                    {channel.type == 'PROTECTED' &&
                    user?.id != channel.owner_id ? (
                      <AskPassword {...channel} />
                    ) : (
                      <Button
                        onClick={() => join(channel)}
                        colorScheme={'blue'}
                      >
                        join
                      </Button>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
