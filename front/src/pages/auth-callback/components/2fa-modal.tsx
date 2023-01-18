import {
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Input,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface TFAModalProps {
  isOpen: boolean;
  isSending2fa: boolean;
  handleSendClick: (tfaToken: string) => void;
  onClose: () => void;
}

export const TFAModal = ({
  isOpen,
  isSending2fa,
  handleSendClick,
  onClose,
}: TFAModalProps) => {
  const [tfaCode, setTkaCode] = useState('');
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTkaCode(event.target.value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>2FA authentication</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Please insert the code for the Two Factor Authentication below
          </Text>
          <Input
            placeholder="123456"
            minLength={6}
            maxLength={6}
            type="number"
            onChange={handleChange}
            value={tfaCode}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={isSending2fa}
            colorScheme="blue"
            mr={3}
            onClick={() => handleSendClick(tfaCode)}
          >
            Send
          </Button>
          <Button onClick={() => navigate('/login')}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
