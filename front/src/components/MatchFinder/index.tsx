import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  RadioGroup,
  Stack,
  Radio,
  Flex,
  Box,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import api from '../../services/api';

import NeonButton from '../NeonButton';
import './style.css';

type MatchType = 'CLASSIC' | 'TURBO';

export default function MatchFinder() {
  const toastId = 'match-finder-error-toast';
  const toast = useToast();

  const [matchType, setMatchType] = useState<MatchType>('TURBO');
  const [isSearching, setIsSearching] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const stopFinding = () => {
    api.stopFindingMatch();
    setIsSearching(false);
  };

  const handleMatchFinderClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isSearching) {
      stopFinding();
    } else {
      onOpen();
    }
  };

  const handleMatchTypeChange = (nextValue: string) => {
    if (nextValue != 'CLASSIC' && nextValue != 'TURBO') {
      setMatchType('CLASSIC');
    }
    setMatchType(nextValue as MatchType);
  };

  const onMatchFindResponse = (data: any) => {
    console.log('server responded via ws: ' + { data });
  };

  const handleFindClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      const result = api.findMatch(matchType, onMatchFindResponse);
    } catch (e) {
      toast({
        id: toastId,
        title: 'Failed to enqueue for matchmaking',
        status: 'error',
        isClosable: true,
        description: (e as Error).message || '',
        duration: 5000,
      });
      setIsSearching(false);
    }

    onClose();
  };

  return (
    <div className="match-finder">
      <Drawer isOpen={isOpen} size="md" onClose={onClose} placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Search for a match</DrawerHeader>
          <DrawerBody>
            <RadioGroup
              defaultValue={matchType}
              onChange={handleMatchTypeChange}
            >
              <Stack mb="4">
                <Radio value={'TURBO'}>TURBO PONG 2.0</Radio>
                <Radio value={'CLASSIC'}>Classic</Radio>
              </Stack>
            </RadioGroup>
          </DrawerBody>
          <DrawerFooter justifyContent={'center'} borderTopWidth="1px" py={8}>
            <NeonButton onClick={handleFindClick}>Find Match</NeonButton>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <NeonButton onClick={handleMatchFinderClick}>
        <Flex alignItems={'center'}>
          <Box>{isSearching ? 'FINDING MATCH' : 'PLAY PONG'}</Box>
          {isSearching && (
            <Box px={4} fontSize="110%">
              X
            </Box>
          )}
        </Flex>
      </NeonButton>
    </div>
  );
}
