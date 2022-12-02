import { LockIcon, UnlockIcon } from '@chakra-ui/icons';
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
} from '@chakra-ui/react';
import { useState, useEffect, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { User, emptyUser } from '../../models/User';
import { Channel } from '../../models/Channel';
import api from '../../services/api';
import userStorage from '../../services/userStorage';
import { StatusCodes } from 'http-status-codes';

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
      if (response.status != 201) {
        toast({
          title: 'Failed to create channel',
          description: response.data.message,
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
            if (res.status == StatusCodes.OK) {
              api
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
                <FormLabel>visibility</FormLabel>
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
      if (res.status == StatusCodes.OK) {
        api.getChannel(channel.id.toString()).then((channel: Channel) => {
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

  const join = (channel: Channel) => {
    api.connectToChannel({ room: channel.id }).then((res) => {
      if (res.status == StatusCodes.OK) {
        api.getChannel(channel.id.toString()).then((channel: Channel) => {
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
    api.getChannels().then((channels) => {
      setChannels(channels);
      setBkpChannels(channels);
    });
  }, []);

  return (
    <>
      <HStack>
        <Input onChange={filterChannel} placeholder="Search channel room" />
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
                    {channel.type == 'PROTECTED' ? (
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
