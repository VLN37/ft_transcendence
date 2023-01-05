import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
        })
        onClose();
      };
      if (data.status == 'ACCEPTED') {
        toast({
          title: 'Friendly match accepted',
          status: 'success',
          description: 'redirecting in 5 seconds',
        });
        setTimeout(() => {
          navigate(`/match/${data.id}`);
        }, 5000);
      };
    });
    return () => {
      chatApi.unsubscribeGameInvite();
      chatApi.unsubscribeGameUpdate();
    };
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent my={'auto'}>
        <ModalHeader>Game invitation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            <b>{user.login_intra}</b> invited you to a friendly match
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button bg={'red.500'} onClick={() => updateGameRequest('DECLINED')}>
            Decline
          </Button>
          <Button
            bg={'green.500'}
            ml={3}
            onClick={() => updateGameRequest('ACCEPTED')}
          >
            Accept
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
