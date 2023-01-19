import { Tr, Td, Image, useDisclosure, HStack, Text } from '@chakra-ui/react';
import { PublicProfile } from '../Profile/profile.public';
import { FaChessQueen, FaCrown } from 'react-icons/fa';
import { GiRibbonMedal } from 'react-icons/gi';
import {
  RiMedal2Fill,
  RiMedal2Line,
  RiMedalFill,
  RiMedalLine,
} from 'react-icons/ri';
import { TbMedal, TbMedal2 } from 'react-icons/tb';
import { RankMenu } from './RankMenu';

function UserBlock(props: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const link = process.env.REACT_APP_BACK_HOSTNAME + props.user.avatar_path;

  function Tier(index: number) {
    switch (true) {
      case index == 1:
        return <FaChessQueen></FaChessQueen>;
      case index == 2:
        return <FaCrown></FaCrown>;
      case index == 3:
        return <RiMedalFill></RiMedalFill>;
      case index > 3 && index <= 6:
        return <RiMedalLine></RiMedalLine>;
      case index > 6 && index <= 10:
        return <RiMedal2Fill></RiMedal2Fill>;
      case index > 10 && index <= 15:
        return <RiMedal2Line></RiMedal2Line>;
      case index > 15 && index <= 25:
        return <TbMedal></TbMedal>;
      case index > 25 && index <= 50:
        return <TbMedal2></TbMedal2>;
      default:
        return <GiRibbonMedal></GiRibbonMedal>;
    }
  }
  return (
    <Tr>
      <Td>
        <HStack>
          {Tier(props.user.rank)}
          <Text>{props.user.rank}</Text>
        </HStack>
      </Td>
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
      <Td>{props.user.login_intra}</Td>
      <Td>{props.user.wins}</Td>
      <Td>{props.user.losses}</Td>
      <Td>{props.user.mmr}</Td>
    </Tr>
  );
}

export { UserBlock };
