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
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
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
  type MatchConvocationState = 'ACCEPTED' | 'DECLINED' | undefined;
  const [convocationState, setConvocationState] =
    useState<MatchConvocationState>();
  const [otherUserConvocationState, setOtherUserConvocationState] =
    useState<MatchConvocationState>();

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

  const handleMatchFinderClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isSearching) {
      mmApi.stopFindingMatch();
      setIsSearching(false);
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

  const onMatchFindResponse = () => {
    setConvocationState(undefined);
    setOtherUserConvocationState(undefined);
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

  const onMatchMakingUpdate = (status: string) => {
    if (status === 'ACCEPTED') {
      setOtherUserConvocationState('ACCEPTED');
      // navigate(`/match/${matchId}`);
    } else {
      setOtherUserConvocationState('DECLINED');
    }
  };

  useEffect(() => {
    mmApi.setMatchMakingUpdateSubscriber((state: string) => {
      onMatchMakingUpdate(state);
    });
    return () => mmApi.unsubscribeMatchMakingUpdate();
  }, []);

  const handleAcceptMatch = () => {
    mmApi.acceptMatch();
    setConvocationState('ACCEPTED');
  };

  const handleDismissMatch = () => {
    if (otherUserConvocationState != 'DECLINED') mmApi.declineMatch();
    setIsSearching(false);
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
          <AlertDialogBody>
            Are you ready?
            <Box>
              {(otherUserConvocationState === 'DECLINED' && (
                <Tag borderRadius="full" variant="solid" colorScheme="red">
                  <TagLabel>The other user declined this match</TagLabel>
                </Tag>
              )) ||
                (otherUserConvocationState === 'ACCEPTED' && (
                  <Tag borderRadius="full" variant="solid" colorScheme="green">
                    <TagLabel>The other user accepted</TagLabel>
                  </Tag>
                ))}
            </Box>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button bg={'red.500'} ref={cancelRef} onClick={handleDismissMatch}>
              {(otherUserConvocationState === 'ACCEPTED' && 'Decline') ||
                (otherUserConvocationState === 'DECLINED' && 'Close') ||
                'Decline'}
            </Button>
            <Button
              bg={'green.500'}
              onClick={handleAcceptMatch}
              ml={3}
              disabled={
                convocationState === 'ACCEPTED' ||
                otherUserConvocationState === 'DECLINED'
              }
            >
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
