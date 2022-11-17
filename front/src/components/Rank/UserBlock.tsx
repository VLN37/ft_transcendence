import { Tr, Td, Image } from '@chakra-ui/react';
import { PublicProfile } from '../Profile/profile.public';
import { RankMenu } from './RankMenu';

function UserBlock(props: any) {

  return (
    <Tr>
      <Td>{props.user.rank}</Td>
      <Td>
        <PublicProfile user={props.user} />
      </Td>
      <Td>{<RankMenu input={props.user.nickname} id={props.user.id} />}</Td>
      <Td>{props.user.id}</Td>
      <Td>{props.user.wins}</Td>
      <Td>{props.user.losses}</Td>
    </Tr>
  );
}

export { UserBlock };
