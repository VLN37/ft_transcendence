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
  InputLeftAddon,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import api from '../../services/api';
import userStorage from '../../services/userStorage';

function InputFileUpload() {
  const [value, setValue] = useState<File | null>(null);
  const toast = useToast();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) setValue(event.target.files[0]);
  };

  async function fileUpload() {
    const formdata = new FormData();
    if (value) formdata.append('avatar', value);

    const response: any = await api.uploadAvatar(formdata);
    const status = response.status == 201 ? 'success' : 'error';
    const message = response.status == 201 ? '' : response.data.message;
    if (response.status == 201) {
      api.getUser('me').then((user) => {
        const link = process.env.REACT_APP_HOSTNAME + user.profile.avatar_path;
        user.profile.avatar_path = link;
        userStorage.saveUser(response.data);
        localStorage.setItem('avatar', link);
      });
    }
    toast({
      title: 'Avatar request sent',
      status: status,
      description: message,
    });
  }

  return (
    <div>
      <InputGroup>
        <InputLeftAddon>Change Avatar</InputLeftAddon>
        <Input
          onChange={handleChange}
          type="file"
          accept=".jpg, .png, .txt"
        ></Input>
        <InputRightElement
          children={<DownloadIcon onClick={fileUpload}></DownloadIcon>}
        ></InputRightElement>
      </InputGroup>
    </div>
  );
}

export function Profile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const link = localStorage.getItem('avatar') || '';

  return (
    <div>
      <Image
        onClick={onOpen}
        marginTop={'15px'}
        borderRadius='full'
        boxSize='65px'
        src={link}
      />
      <Modal isOpen={isOpen} onClose={onClose} size={'3xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton></ModalCloseButton>
          <ModalHeader>Profile</ModalHeader>
          <ModalBody>
            <Image src={link} boxSize='200px'></Image>
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
              <GridItem colStart={1}></GridItem>
              <GridItem colStart={1}>
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
