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
  Stack,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { useState } from 'react';
import { emptyUser, User } from '../../models/User';
import api from '../../services/api';
import userStorage from '../../services/userStorage';

function InputFileUpload() {
  const [value, setValue] = useState<File | null>(null);
  const toast = useToast();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) setValue(event.target.files[0]);
  };

  async function fileUpload() {
    if (!value) return;
    const formdata = new FormData();
    formdata.append('avatar', value);

    const response: any = await api.uploadAvatar(formdata);
    const status = response.status == 201 ? 'success' : 'error';
    const message = response.status == 201 ? '' : response.data.message;
    if (response.status == 201) {
      api.getUser('me').then((user) => {
        const link = process.env.REACT_APP_HOSTNAME + user.profile.avatar_path;
        user.profile.avatar_path = link;
        console.log('user', user);
        userStorage.saveUser(user);
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
      <InputGroup size="md">
        <InputLeftAddon children="Change avatar"></InputLeftAddon>
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

function NicknameUpdate(props: { user: User }) {
  const [name, setName] = useState<string>(props.user.profile.nickname);
  const toast = useToast();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  async function UploadName() {
    if (name === props.user.profile.nickname)
      return;
    const response: any = await api.uploadNickname(props.user, name);
    const status = response.status == 200 ? 'success' : 'error';
    const message = response.status == 200 ? '' : response.data.message;
    if (response.status == 200) {
      props.user.profile.nickname = name;
      userStorage.saveUser(props.user);
    }
    toast({
      title: 'Nickname change request sent',
      status: status,
      description: message,
    });
  }

  return (
    <div>
      <InputGroup size="md">
        <InputLeftAddon children="Change Name"></InputLeftAddon>
        <Input
          onChange={handleChange}
          type="text"
          placeholder={name}
        ></Input>
        <InputRightElement
          children={<DownloadIcon onClick={UploadName}></DownloadIcon>}
        ></InputRightElement>
      </InputGroup>
    </div>
  );
}

export function Profile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const link = localStorage.getItem('avatar') || '';
  const user: User = userStorage.getUser() || emptyUser();

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
            <Stack spacing={4}>
              <Grid templateColumns={'repeat(5, 1 fr)'}>
                <GridItem colStart={1}>
                  <Image src={link} boxSize="200px"></Image>
                </GridItem>
                <GridItem colStart={2}>
                  <Stat>
                    <StatLabel>Login</StatLabel>
                    <StatNumber>{user.login_intra}</StatNumber>
                    <StatLabel>Wins</StatLabel>
                    <StatNumber>{user.profile.wins}</StatNumber>
                    <StatLabel>Losses</StatLabel>
                    <StatNumber>{user.profile.losses}</StatNumber>
                  </Stat>
                </GridItem>
                <GridItem colStart={3}>
                  <Stat>
                    <StatLabel>Nickname</StatLabel>
                    <StatNumber>{user.profile.nickname}</StatNumber>
                    <StatLabel>MMR</StatLabel>
                    <StatNumber>{user.profile.mmr}</StatNumber>
                    <StatLabel>Status</StatLabel>
                    <StatNumber>{user.profile.status}</StatNumber>
                  </Stat>
                </GridItem>
              </Grid>
              <Grid templateColumns={'repeat(5, 1 fr)'}>
                <GridItem colStart={1}>
                  <Stack spacing={4}>
                    <NicknameUpdate user={user} />
                    <InputFileUpload />
                    <Switch>2FA</Switch>
                  </Stack>
                </GridItem>
              </Grid>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
