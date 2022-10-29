import {
  Image,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'

export function Profile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const link =
    JSON.parse(localStorage.getItem('user') || '').profile.avatar_path || '';
  return (
    <div>
    <Image onClick={onOpen}
      marginTop={'15px'}
      borderRadius="full"
      boxSize="65px"
      src={link}
    />
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          {/* <ModalCloseButton></ModalCloseButton> */}
          <ModalHeader>Profile</ModalHeader>
          <ModalBody>
            <p>mimimi</p>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>close</Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
    </div>

  )
}

