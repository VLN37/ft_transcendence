import {
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { emptyUser, User } from '../../models/User';
import { chatApi } from '../../services/api_index';
import ChatApi from '../../services/ChatApi';
import MMapi from '../../services/MMapi';
import userStorage from '../../services/userStorage';

export default function GameInvite(props: {}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState(emptyUser());
  const [host, setHost] = useState(false);
  const [status, setStatus] = useState('');
  const me: User = userStorage.getUser() || emptyUser();
  let navigate = useNavigate();
  const toast = useToast();

  const updateGameRequest = (status: string) => {
    MMapi.updateGameRequest(status, user, me);
  };

  useEffect(() => {
    ChatApi.subscribeGameInvite((user: any) => {
      setUser({ ...user });
      onOpen();
    });
    ChatApi.subscribeGameUpdate((data: any) => {
      if (data.status == 'DECLINED') {
        toast({
          title: 'Friendly match invitation declined',
          status: 'warning',
        });
        setStatus('DECLINED');
        onClose();
      }
      if (data.status == 'ACCEPTED') {
        toast({
          title: 'Friendly match accepted',
          status: 'success',
          description: 'redirecting in 5 seconds',
        });
        setStatus('ACCEPTED');
        setUser(data.user);
        setHost(data.host);
        onOpen();
        setTimeout(() => {
          navigate(`/match/${data.id}`);
        }, 5000);
      }
    });
    return () => {
      chatApi.unsubscribeGameInvite();
      chatApi.unsubscribeGameUpdate();
    };
  });

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent my={'auto'}>
        <ModalHeader>Game invitation</ModalHeader>
        <ModalBody>
          <Flex>
            <Image
              marginRight={5}
              borderRadius="full"
              boxSize="65px"
              src={
                process.env.REACT_APP_BACK_HOSTNAME + user.profile.avatar_path
              }
            ></Image>
            <Text alignSelf={'center'} display={host ? 'none' : 'block'}>
              <b>{user.login_intra}</b> invited you to a friendly match
            </Text>
            <Text alignSelf={'center'} display={host ? 'block' : 'none'}>
              <b>{user.login_intra}</b> accepted your invite
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Flex display={status == 'ACCEPTED' ? 'none' : 'block'}>
            <Button
              bg={'red.500'}
              onClick={() => updateGameRequest('DECLINED')}
            >
              Decline
            </Button>
            <Button
              bg={'green.500'}
              ml={3}
              onClick={() => updateGameRequest('ACCEPTED')}
            >
              Accept
            </Button>
          </Flex>
          <Flex mx={'auto'} display={status == 'ACCEPTED' ? 'block' : 'none'}>
            <Spinner />
            <Text as={'b'} ml={'3'}>
              creating match...
            </Text>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
