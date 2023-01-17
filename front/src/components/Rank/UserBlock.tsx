import { Tr, Td, Image, useDisclosure } from '@chakra-ui/react';
import { PublicProfile } from '../Profile/profile.public';
import { RankMenu } from './RankMenu';

function UserBlock(props: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const link = process.env.REACT_APP_BACK_HOSTNAME + props.user.avatar_path;

  return (
    <Tr>
      <Td>{props.user.rank}</Td>
      <Td>
        <Image
          onClick={onOpen}
          marginTop={'15px'}
          borderRadius="full"
          boxSize="65px"
          src={link}
		  border={'2px'}
		  boxShadow={'dark-lg'}
        />
        <PublicProfile isOpen={isOpen} onClose={onClose} user={props.user} />
      </Td>
      <Td>{<RankMenu username={props.user.nickname} id={props.user.id} />}</Td>
      <Td>{props.user.id}</Td>
      <Td>{props.user.wins}</Td>
      <Td>{props.user.losses}</Td>
    </Tr>
  );
}

export { UserBlock };
