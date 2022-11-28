import { SettingsIcon } from '@chakra-ui/icons';
import {
  Grid,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  StatLabel,
  StatNumber,
  useDisclosure,
} from '@chakra-ui/react';
import { channel } from 'diagnostics_channel';
import { Channel } from '../../models/Channel';

export function ChatSettings(props:{
  channel: Channel,
  setChannel: any
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <SettingsIcon onClick={onOpen} marginTop={3} boxSize={7} />
      <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Channel {props.channel.name}</ModalHeader>
        <ModalBody>
          lorem ipsum dolor sit amet
        </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
