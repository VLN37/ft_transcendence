import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Match } from '../../models/Match';
import { emptyUser } from '../../models/User';
import MatchesApi from '../../services/MatchesApi';
import userStorage from '../../services/userStorage';

export function less<T>(a: T, b: T): number {
  return a === b ? 0 : a > b ? 1 : -1;
}

function randomMatch(): Match {
  return {
    id: Math.floor(Math.random() * 100).toString(),
    left_player: emptyUser(),
    right_player: emptyUser(),
    left_player_score: Math.floor(Math.random() * 3),
    right_player_score: Math.floor(Math.random() * 3),
    stage: 'FINISHED',
    created_at: new Date(),
    type: 'CLASSIC',
  };
}

function emptyMatch(): Match {
  return {
    id: '',
    left_player: emptyUser(),
    right_player: emptyUser(),
    left_player_score: 0,
    right_player_score: 0,
    stage: 'FINISHED',
    created_at: new Date(),
    type: 'CLASSIC',
  }
}

function MatchBlock(props: { match: Match }) {
  const me = userStorage.getUser() || emptyUser();
  const match = props.match;
  let result: number;
  let resultString: string = '';
  let color: string = '';
  if (props.match.left_player.login_intra == me.login_intra)
    result = less(match.left_player_score, match.right_player_score);
  else result = less(match.right_player_score, match.left_player_score);
  switch (result) {
    case 1:
      color = 'green.500';
      resultString = 'WIN';
      break;
    case 0:
      color = 'grey.500';
      resultString = 'TIE';
      break;
    case -1:
      color = 'red.500';
      resultString = 'LOSS';
  }
  return (
    <Tr>
      <Td>{props.match.type}</Td>
      <Td>{props.match.left_player.profile.nickname}</Td>
      <Td>{`${match.left_player_score} - ${match.right_player_score}`}</Td>
      <Td>{props.match.right_player.profile.nickname}</Td>
      <Td>
        <Text
          textAlign={'center'}
          bgColor={color}
          border={'1px'}
          borderColor={'black.500'}
        >
          {resultString}
        </Text>
      </Td>
    </Tr>
  );
}

function MatchTable(props: {
  userId: number,
}) {
  const [matchesList, setMatchList] = useState<Match[]>([emptyMatch()]);

  useEffect(() => {
    async function fetchMatches() {
      setMatchList(await MatchesApi.getUserMatches(props.userId, 10));
    }
    fetchMatches();
  }, []);

  const matchList = matchesList.map((elem, index) => {
    return <MatchBlock match={elem} key={index}></MatchBlock>;
  });
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Match Type</Th>
            <Th>PLAYER 1</Th>
            <Th>score</Th>
            <Th>PLAYER 2</Th>
            <Th>result</Th>
          </Tr>
        </Thead>
        <Tbody>{matchList}</Tbody>
      </Table>
    </TableContainer>
  );
}

export function MatchHistory(props: {
  isOpen: any;
  onClose: any;
  username: string;
  id: number,
}) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size={'3xl'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader alignSelf={'center'}>
          {props.username}'s Match History
        </ModalHeader>
        <ModalCloseButton></ModalCloseButton>
        <ModalBody>
          <MatchTable userId={props.id}/>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
