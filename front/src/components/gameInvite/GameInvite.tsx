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
import { emptyUser, User } from '../../models/User';
import { chatApi } from '../../services/api_index';
import ChatApi from '../../services/ChatApi';

export default function GameInvite(props: {}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [user, setUser] = useState(emptyUser());
  useEffect(() => {
    ChatApi.subscribeGameInvite((user: any) => {
      setUser({ ...user });
      onOpen();
    });
    return () => chatApi.unsubscribeGameInvite();
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
          <Button>Accept</Button>
          <Button>Decline</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
