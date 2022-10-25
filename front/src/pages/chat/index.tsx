import { ArrowRightIcon, SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  Text,
  Textarea,
  Image,
  IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function Message(props: any) {
  return (
    <Flex>
      <Box padding={'1rem'}>
        <Image
          border={'2px'}
          borderColor={'green.500'}
          borderRadius="5px"
          boxSize={'80px'}
          src={props.image}
          alt={props.name}
        />
        <Text paddingTop={'0.1rem'} fontWeight={'bold'} align={'center'}>
          {props.name}
        </Text>
      </Box>
      <Flex alignItems={'center'}>
        <Text padding={'0.2rem'} mt={'-1rem'}>
          {props.text}
        </Text>
      </Flex>
    </Flex>
  );
}

function Users() {
  return (
    <>
      <h1>USERS1</h1>
      <h1>USERS2</h1>
    </>
  );
}

function InputMessage() {
  return (
    <>
      <Flex alignItems={'center'}>
        <Textarea
          size={'lg'}
          padding={'1rem'}
          placeholder="Here is a sample placeholder"
        />
        <Box padding={'1rem'}>
          <IconButton aria-label="Search database" icon={<ArrowRightIcon />} />
        </Box>
      </Flex>
    </>
  );
}

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Container maxW="1200px" maxHeight={'80vh'} overflowY={'auto'}>
      <Center paddingY={'0.5rem'} color="white">
        <Text fontSize="3xl">{'CHANNEL #' + searchParams.get('id')}</Text>
      </Center>
      <Grid
        templateAreas={`"friends" "content" "send"`}
        h="70vh"
        templateRows="repeat(6, 1fr)"
        templateColumns="repeat(6, 1fr)"
        gap={5}
      >
        <GridItem colSpan={1} rowSpan={6} bg="gray.700" borderRadius={'5px'}>
          <Users />
        </GridItem>
        <GridItem
          colSpan={5}
          rowSpan={5}
          bg="gray.700"
          overflowY={'auto'}
          borderRadius={'5px'}
        >
          <Message
            name={'Jovikovich'}
            image={'https://bit.ly/dan-abramov'}
            text={'kkkkkkkkkkkkkkkkkkkkkkkkkkkk'}
          />
        </GridItem>
        <GridItem colSpan={5} rowSpan={1} bg="gray.700" borderRadius={'5px'}>
          <InputMessage />
        </GridItem>
      </Grid>
    </Container>
  );
}
