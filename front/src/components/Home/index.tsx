import './style.css';
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { IoDiamond } from 'react-icons/io5';
import { DmUsers } from '../Chat/DmUsers';
import userStorage from '../../services/userStorage';

function User() {
  return (
    <Flex width={'100%'} padding={'1rem'} gap={5}>
      <Flex flex={2} flexDirection={'column'}>
        <Image
          bg={'black'}
          borderRadius={'10px'}
          boxShadow="dark-lg"
          rounded="md"
          src="http://localhost:3000/avatars/wleite.jpeg"
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
          <DmUsers
            users={userStorage.getUser()?.friends || []}
            requests={userStorage.getUser()?.friend_requests || []}
          />
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
              Victories: 42
            </Text>
            <Text as={'b'} size={'lg'}>
              Losses: 21
            </Text>
          </Flex>
          <Icon mx={'auto'} my={'auto'} fontSize={'60px'} as={IoDiamond} />
        </Box>
        <Flex my={'0.5rem'} direction={'column'} gap={'0.5rem'}>
          <Text textAlign={'center'} fontSize={'xl'}>
            Your Matches
          </Text>
          <Text
            py={'0.5rem'}
            textAlign={'center'}
            bg={'gray.800'}
            fontSize={'lg'}
            borderRadius={'5px'}
            boxShadow={'dark-lg'}
            border={'1px solid rgba(255, 255, 255, 0.3)'}
          >
            João 13 X 23 Paulo
          </Text>
          <Text
            py={'0.5rem'}
            textAlign={'center'}
            bg={'gray.800'}
            fontSize={'lg'}
            borderRadius={'5px'}
            boxShadow={'dark-lg'}
            border={'1px solid rgba(255, 255, 255, 0.3)'}
          >
            João 13 X 23 Paulo
          </Text>
          <Text
            py={'0.5rem'}
            textAlign={'center'}
            bg={'gray.800'}
            fontSize={'lg'}
            borderRadius={'5px'}
            boxShadow={'dark-lg'}
            border={'1px solid rgba(255, 255, 255, 0.3)'}
          >
            João 13 X 23 Paulo
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}

function Matches() {
  const matches = [
    'Gabriel 4 X 4 Henrique | 02:45 | 0 / 0',
    'Wleite 4 X 4 Henrique | 02:45 | 0 / 0',
    'Gabriel 4 X 4 Henrique | 02:45 | 0 / 0',
    'Gabriel 4 X 4 Henrique | 02:45 | 0 / 0',
    'Gabriel 4 X 4 Henrique | 02:45 | 0 / 0',
    'Gabriel 4 X 4 Henrique | 02:45 | 0 / 0',
    'Gabriel 4 X 4 Henrique | 02:45 | 0 / 0',
    'Gabriel 4 X 4 Henrique | 02:45 | 0 / 0',
    'Gabriel 4 X 4 Henrique | 02:45 | 0 / 0',
    'Gabriel 4 X 4 Henrique | 02:45 | 0 / 0',
    'Gabriel 4 X 4 Henrique | 02:45 | 0 / 0',
    'Gabriel 4 X 4 Henrique | 02:45 | 0 / 0',
    'Gabriel 4 X 4 Henrique | 02:45 | 0 / 0',
    'Wleite 4 X 4 Henrique | 02:45 | 0 / 0',
  ];
  matches.splice(8);
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
          LAST MATCHES
        </Text>
        {matches.map((match, index) => {
          return (
            <Flex
              bg={'gray.800'}
              paddingY={'0.5rem'}
              borderRadius={'5px'}
              boxShadow={'dark-lg'}
              border={'1px solid rgba(255, 255, 255, 0.3)'}
              marginY={'0.1rem'}
            >
              <Flex flex={4}>
                <Text as={'b'} margin={'auto'}>
                  {match}
                </Text>
              </Flex>
              <Flex flex={1}>
                <Button bg={'red'} fontSize={'md'} borderRadius={'2px'}>
                  LIVE
                </Button>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
}

export function Home() {
  return (
    <Flex className="homeWrapper" height={'75vh'} gap={2} overflow={'scroll'}>
      <Flex minH={'100%'} bg={'gray.700'} flex={2} borderRadius={'5px'}>
        <User />
      </Flex>
      <Flex minH={'100%'} bg={'gray.700'} flex={2} borderRadius={'5px'}>
        <Matches />
      </Flex>
    </Flex>
  );
}
