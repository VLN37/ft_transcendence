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
  Grid,
  GridItem,
  Switch,
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
    <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton></ModalCloseButton>
          <ModalHeader>Profile</ModalHeader>
          <ModalBody>
            <Grid templateColumns={'repeat(5, 1 fr)'}>
              <GridItem colStart={1} >Nickname</GridItem>
              <GridItem colStart={5}><Button>change</Button></GridItem>
            </Grid>
            <Grid templateColumns={'repeat(5, 1 fr)'}>
              <GridItem colStart={1} >2FA<Switch></Switch></GridItem>
              <GridItem colStart={5}><Button>change</Button></GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>close</Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
    </div>

  )
}

