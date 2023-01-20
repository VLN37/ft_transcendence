import { DownloadIcon } from '@chakra-ui/icons';
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
  Input,
  InputGroup,
  InputRightElement,
  InputLeftAddon,
  useToast,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Box,
} from '@chakra-ui/react';
import { useState } from 'react';
import { emptyUser, User } from '../../models/User';
import { userApi, profileApi } from '../../services/api_index';
import userStorage from '../../services/userStorage';
import TwoFA from '../TwoFA/TwoFA';

function InputFileUpload(props: any) {
  const [value, setValue] = useState<File | null>(null);
  const toast = useToast();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) setValue(event.target.files[0]);
  };

  async function fileUpload() {
    if (!value) return;
    const formdata = new FormData();
    formdata.append('avatar', value);

    const response: any = await profileApi.uploadAvatar(formdata);
    const status = response.status == 201 ? 'success' : 'error';
    let message = response.status == 201 ? '' : response.data.message;
    if (!message) message = 'File too large';
    if (response.status != 201) {
      userApi.getUser('v2/me').then((user) => {
        const link =
          process.env.REACT_APP_BACK_HOSTNAME + user.profile.avatar_path;
        userStorage.saveUser(user);
        localStorage.setItem('avatar', link);
        props.setAvatar(link);
        props.setAvatarProfile(link);
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

function NicknameUpdate(props: { user: User; setNickname: any }) {
  const [name, setName] = useState<string>(props.user.profile.nickname);
  const toast = useToast();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  async function UploadName() {
    if (name === props.user.profile.nickname) return;
    const response: any = await profileApi.uploadNickname(props.user, name);
    if (!response) return;
    const status = response.status == 200 ? 'success' : 'error';
    const message = response.status == 200 ? '' : response.data.message;
    if (response.status == 200) {
      props.user.profile.nickname = name;
      userStorage.saveUser(props.user);
      props.setNickname(name);
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
        <Input onChange={handleChange} type="text" placeholder={name}></Input>
        <InputRightElement
          children={<DownloadIcon onClick={UploadName}></DownloadIcon>}
        ></InputRightElement>
      </InputGroup>
    </div>
  );
}

export function Profile(props: {
  isOpen: any,
  onClose: any,
  setAvatar: any
}) {
  const user: User = userStorage.getUser() || emptyUser();
  const [nickname, setNickname] = useState<string>(user.profile.nickname);
  const [avatar, setAvatarProfile] = useState<string>(
    localStorage.getItem('avatar') || '',
  );

  return (
    <Box marginY={'auto'}>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size={'3xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton></ModalCloseButton>
          <ModalHeader>Profile</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <Grid templateColumns={'repeat(5, 1 fr)'}>
                <GridItem colStart={1}>
                  <Image src={avatar} boxSize="200px"></Image>
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
                    <StatNumber>{nickname}</StatNumber>
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
                    <NicknameUpdate user={user} setNickname={setNickname} />
                    <InputFileUpload
                      setAvatar={props.setAvatar}
                      setAvatarProfile={setAvatarProfile}
                    />
                  </Stack>
                </GridItem>
                <TwoFA></TwoFA>
              </Grid>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={props.onClose}>close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
