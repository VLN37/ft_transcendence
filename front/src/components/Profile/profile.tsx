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
  InputLeftElement,
  InputLeftAddon,
  useToast,
} from '@chakra-ui/react';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import api from '../../services/api';

function InputFileUpload() {
  const [value, setValue] = useState<File | null>(null);
  const toast = useToast();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) setValue(event.target.files[0]);
  };

  async function fileUpload() {
    const formdata = new FormData();
    if (value) formdata.append('avatar', value);

    const response:
      | AxiosResponse<any, any>
      | AxiosResponse<unknown, any>
      | undefined = await api.uploadAvatar(formdata);
    if (!response)
      return;
    const status = response.status == 201 ? 'success' : 'error';
    const message = response.status == 201 ? '' : 'invalid file type';
    toast({
      title: 'Avatar request sent',
      status: status,
      description:  message,
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
