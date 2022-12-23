import './style.css';
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { IoDiamond } from 'react-icons/io5';
import { TfiFaceSad } from 'react-icons/tfi';
import { DmUsers } from '../Chat/DmUsers';
import { emptyUser, User } from '../../models/User';
import userApi from '../../services/UserApi';
import { useEffect, useState } from 'react';
import { Match } from '../../models/Match';
import matchesApi from '../../services/MatchesApi';

function getUserRank(user: User) {
  return <Icon mx={'auto'} my={'auto'} fontSize={'60px'} as={IoDiamond} />;
}

function formatMatchName(match: Match): string {
  return (
    match.left_player.profile.nickname +
    ' ' +
    match.left_player_score +
    ' X ' +
    match.right_player_score +
    ' ' +
    match.right_player.profile.nickname
  );
}

function formatMatchSubTitle(match: Match): string {
  const tmp = new Date(match.created_at);
  const date = tmp.toLocaleDateString('pt-BR', {});
//   return date + ' | ' + match.type;
  return date + ' | ' + 'TURBO';
}

function UserComp(user: User) {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    matchesApi.getUserMatches(10).then((matchs: Match[]) => setMatches(matchs));
  }, []);

  return (
    <Flex width={'100%'} padding={'1rem'} gap={5}>
      <Flex flex={2} flexDirection={'column'}>
        <Image
          bg={'black'}
          borderRadius={'10px'}
          boxShadow="dark-lg"
          rounded="md"
          src={
            user.profile.avatar_path &&
            process.env.REACT_APP_BACK_HOSTNAME + user.profile.avatar_path
          }
          marginBottom={'1rem'}
        />
        <Box
          borderRadius={'5px'}
          padding={'0.2rem'}
          boxShadow={'dark-lg'}
          border={'1px solid rgba(255, 255, 255, 0.3)'}
          bg={'gray.800'}
          height={'100%'}
        >
          <DmUsers users={user.friends} requests={user.friend_requests} />
        </Box>
      </Flex>
      <Flex flex={5} flexDirection={'column'}>
        <Box
          width={'100%'}
          bg={'gray.800'}
          borderRadius={'5px'}
          display={'inline-flex'}
          boxShadow={'dark-lg'}
          border={'1px solid rgba(255, 255, 255, 0.3)'}
        >
          <Flex flexDirection={'column'} padding={'1rem'} gap={1}>
            <Text as={'b'} size={'lg'}>
              Rank: 12
            </Text>
            <Text as={'b'} size={'lg'}>
              Victories: {user.profile.wins}
            </Text>
            <Text as={'b'} size={'lg'}>
              Losses: {user.profile.losses}
            </Text>
          </Flex>
          {getUserRank(user)}
        </Box>
        <Flex my={'0.5rem'} direction={'column'} gap={'0.5rem'}>
          <Text textAlign={'center'} fontSize={'xl'}>
            MATCH HISTORY
          </Text>

          {matches.map((match, index) => {
            return (
              <Box
                key={index}
                bg={'gray.800'}
                borderRadius={'5px'}
                boxShadow={'dark-lg'}
                border={'1px solid rgba(255, 255, 255, 0.3)'}
              >
                <Text textAlign={'center'} fontSize={'lg'}>
                  {formatMatchName(match)}
                </Text>
                <Text color={'gray.300'} textAlign={'center'} fontSize={'xs'}>
                  {formatMatchSubTitle(match)}
                </Text>
              </Box>
            );
          })}
          {!matches.length && (
            <>
              <Text fontSize={'2xl'} align={'center'}>
                No matches found
              </Text>
              <Text fontSize={'2xl'} align={'center'}>
              Go play some!
              </Text>
              {/* <Icon mx={'auto'} fontSize={'80px'} as={TfiFaceSad} /> */}
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

function Matches(matches: Match[]) {
  matches = Object.values(matches);

  return (
    <Flex mx={'auto'} width={'100%'} flexDirection={'row'}>
      <Flex
        my={'0.5rem'}
        mx={'1rem'}
        width={'100%'}
        direction={'column'}
        gap={'0.5rem'}
      >
        <Text textAlign={'center'} fontSize={'xl'}>
          PUBLIC MATCHES
        </Text>
        {matches.map((match, index) => {
          return (
            <Flex
              key={index}
              bg={'gray.800'}
              paddingY={'0.35rem'}
              borderRadius={'5px'}
              boxShadow={'dark-lg'}
              border={'1px solid rgba(255, 255, 255, 0.3)'}
              marginY={'0.1rem'}
            >
              <Flex flex={4}>
                <Box mx={'auto'}>
                  <Text textAlign={'center'} fontSize={'lg'}>
                    {formatMatchName(match)}
                  </Text>
                  <Text color={'gray.300'} textAlign={'center'} fontSize={'xs'}>
                    {formatMatchSubTitle(match)}
                  </Text>
                </Box>
              </Flex>
              <Flex flex={1}>
                <Button
                  bg={'red'}
                  fontSize={'md'}
                  borderRadius={'2px'}
                  visibility={match.stage === 'ONGOING' ? 'visible' : 'hidden'}
                >
                  LIVE
                </Button>
              </Flex>
            </Flex>
          );
        })}
        {!matches.length && (
          <>
            <Text fontSize={'2xl'} align={'center'}>
              No matches found
            </Text>
            <Text fontSize={'2xl'} align={'center'}>
              Go play some!
            </Text>
            {/* <Icon mx={'auto'} fontSize={'80px'} as={TfiFaceSad} /> */}
          </>
        )}
      </Flex>
    </Flex>
  );
}

export function Home() {
  const [user, setUser] = useState(emptyUser());
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    userApi.getMe().then((_user) => setUser(_user));
    matchesApi.getLiveMatches(10).then((matchs: Match[]) => setMatches(matchs));
  }, []);

  return (
    <Flex className="homeWrapper" height={'75vh'} gap={2} overflowY={'scroll'}>
      <Flex minH={'100%'} bg={'gray.700'} flex={2} borderRadius={'5px'}>
        <UserComp {...user} />
      </Flex>
      <Flex minH={'100%'} bg={'gray.700'} flex={2} borderRadius={'5px'}>
        <Matches {...matches} />
      </Flex>
    </Flex>
  );
}