import { AttachmentIcon, CheckIcon, DownloadIcon } from '@chakra-ui/icons';
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
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useState } from 'react';

function SendButton() {
  return <Button></Button>;
}

function InputFileUpload() {
  const [value, setValue] = useState('');
  const handleChange = (event: any) => setValue(event.target.value);

  const fileUpload = () => console.log('uploading ', value);

  return (
    <InputGroup size="md">
      <Input
        value={value}
        onChange={handleChange}
        type="file"
        accept=".jpg, .png"
      ></Input>
      <InputRightElement
        children={<DownloadIcon onClick={fileUpload} />}
      ></InputRightElement>
    </InputGroup>
  );
}

export function Profile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const link =
    JSON.parse(localStorage.getItem('user') || '').profile.avatar_path || '';
  return (
    <div>
      <Image
        onClick={onOpen}
        marginTop={'15px'}
        borderRadius="full"
        boxSize="65px"
        src={link}
      />
      <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton></ModalCloseButton>
          <ModalHeader>Profile</ModalHeader>
          <ModalBody>
            <Image src={link}></Image>
            <Grid templateColumns={'repeat(5, 1 fr)'}>
              <GridItem colStart={1}>Nickname</GridItem>
              <GridItem colStart={5}>
                <Button>change</Button>
              </GridItem>
            </Grid>
            <Grid templateColumns={'repeat(5, 1 fr)'}>
              <GridItem colStart={1}>2FA</GridItem>
              <GridItem colStart={5}>
                <Switch></Switch>
              </GridItem>
            </Grid>
            <Grid templateColumns={'repeat(5, 1 fr)'}>
              <GridItem colStart={1}>Change avatar</GridItem>
              <GridItem colStart={2}>
                <InputFileUpload />
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
