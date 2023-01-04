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

  const updateGameRequest = (status: string) => {
    MMapi.updateGameRequest(status, user, me);
  };

  useEffect(() => {
    ChatApi.subscribeGameInvite((user: any) => {
      setUser({ ...user });
      onOpen();
    });
    ChatApi.subscribeGameUpdate((data: any) => {
      if (data.status == 'DECLINED') onClose();
      if (data.status == 'ACCEPTED') navigate(`/match/${data.id}`);
    });
    return () => {
      chatApi.unsubscribeGameInvite();
	  chatApi.unsubscribeGameUpdate();
    };
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Game invitation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{user.login_intra}</Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => updateGameRequest('ACCEPTED')}>Accept</Button>
          <Button onClick={() => updateGameRequest('DECLINED')}>Decline</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
