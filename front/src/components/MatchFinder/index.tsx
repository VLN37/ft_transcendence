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
import api from '../../services/api';

import NeonButton from '../NeonButton';
import './style.css';

type MatchType = 'CLASSIC' | 'TURBO';

export default function MatchFinder() {
  const toastId = 'match-finder-error-toast';
  const toast = useToast();

  const [matchType, setMatchType] = useState<MatchType>('TURBO');
  const [isSearching, setIsSearching] = useState(false);

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
    api.stopFindingMatch();
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
    console.log('server responded via ws: ' + { data });
    openAlert();
  };

  const handleFindClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSearching(true);
    try {
      api.findMatch(matchType, onMatchFindResponse);
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

  return (
    <div className="match-finder">
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={closeAlert}
        isOpen={isAlertOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to discard all of your notes? 44 words will be
            deleted.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={closeAlert}>
              No
            </Button>
            <Button colorScheme="red" ml={3}>
              Yes
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
