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
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mmApi } from '../../services/api_index';

import NeonButton from '../NeonButton';
import './style.css';

type MatchType = 'CLASSIC' | 'TURBO';

export default function MatchFinder() {
  const toastId = 'match-finder-error-toast';
  const toast = useToast();

  const navigate = useNavigate();

  const [matchType, setMatchType] = useState<MatchType>('TURBO');
  const [isSearching, setIsSearching] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);

  const cancelRef = React.useRef(null);
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: openAlert,
    onClose: closeAlert,
  } = useDisclosure();

  const stopFinding = () => {
    mmApi.stopFindingMatch();
    setIsSearching(false);
  };

  const handleMatchFinderClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isSearching) {
      stopFinding();
    } else {
      openDrawer();
    }
  };

  const handleMatchTypeChange = (nextValue: string) => {
    if (nextValue != 'CLASSIC' && nextValue != 'TURBO') {
      setMatchType('CLASSIC');
    }
    setMatchType(nextValue as MatchType);
  };

  const onMatchFindResponse = (data: any) => {
    console.log('server responded via ws: ', { data });
    setMatchId(data.matchData.id);
    openAlert();
  };

  const handleFindClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      mmApi.findMatch(matchType, onMatchFindResponse);
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

    closeDrawer();
  };

  const handleAcceptMatch = () => {
    stopFinding();
    closeAlert();
    navigate(`/match/${matchId}`);
  };

  const handleDismissMatch = () => {
    stopFinding();
    closeAlert();
  };

  return (
    <div className="match-finder">
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={closeAlert}
        isOpen={isAlertOpen}
        isCentered
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Match found!</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Are you ready?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={handleDismissMatch}>
              Dismiss
            </Button>
            <Button onClick={handleAcceptMatch} colorScheme="red" ml={3}>
              Accept
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Drawer
        isOpen={isDrawerOpen}
        size="md"
        onClose={closeDrawer}
        placement="right"
      >
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
            <Box px={4}>
              <Spinner />
            </Box>
          )}
        </Flex>
      </NeonButton>
    </div>
  );
}
