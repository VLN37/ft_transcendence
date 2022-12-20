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
  useToast,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { TableUser } from '../../models/TableUser';
import { emptyUser, User } from '../../models/User';
import { profileApi } from '../../services/api_index';
import userStorage from '../../services/userStorage';

export function PublicProfile(props: {
  user: TableUser;
  isOpen: boolean;
  onClose: () => void;
}) {
  const link = process.env.REACT_APP_BACK_HOSTNAME + props.user.avatar_path;
  const toast = useToast();

  async function addFriend() {
    const me: User = userStorage.getUser() || emptyUser();
    const myId: number = me.id;
    const response: any = await profileApi.addFriend(myId, props.user.id);
    const status = response.status == 200 ? 'success' : 'error';
    const message = response.status == 200 ? '' : response.data.message;
    if (response.status == 200) await userStorage.updateUser();
    toast({
      title: 'Friend request sent',
      status: status,
      description: message,
    });
  }

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={props.onClose} size={'3xl'}>
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
                    <StatNumber>{props.user.login_intra}</StatNumber>
                    <StatLabel>Wins</StatLabel>
                    <StatNumber>{props.user.wins}</StatNumber>
                    <StatLabel>Losses</StatLabel>
                    <StatNumber>{props.user.losses}</StatNumber>
                  </Stat>
                  <Button onClick={addFriend}>Add Friend</Button>
                </GridItem>
                <GridItem colStart={3}>
                  <Stat>
                    <StatLabel>Nickname</StatLabel>
                    <StatNumber>{props.user.nickname}</StatNumber>
                    <StatLabel>MMR</StatLabel>
                    <StatNumber>{props.user.mmr}</StatNumber>
                    <StatLabel>Status</StatLabel>
                    <StatNumber>{props.user.status}</StatNumber>
                  </Stat>
                </GridItem>
              </Grid>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={props.onClose}>close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
