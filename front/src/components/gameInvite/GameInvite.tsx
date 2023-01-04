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
import { useEffect } from 'react';
import { chatApi } from '../../services/api_index';
import ChatApi from '../../services/ChatApi';

export default function GameInvite(props: {}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    ChatApi.subscribeGameInvite(() => {
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
          <Text>body</Text>
        </ModalBody>
        <ModalFooter>
          <Button>Accept</Button>
          <Button>Decline</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
