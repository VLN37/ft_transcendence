import { Text, UnorderedList, ListItem } from '@chakra-ui/react';

export default function Instructions() {
  return (
    <>
      <br />
      <br />
      <Text align={'center'} as="b">
        Commands
      </Text>
      <Text>Control pong with W and S</Text>
      <br />
      <Text align={'center'} as="b">
        Game types
      </Text>
      <Text>Classic - the pong experience</Text>
      <Text>Turbo - faster, extra power-ups</Text>
      <br />
      <Text align={'center'} as="b">
        Power-ups:
      </Text>
      <UnorderedList>
        <ListItem marginLeft={'1rem'}>inverted opponent controls</ListItem>
        <ListItem marginLeft={'1rem'}>slow opponent</ListItem>
        <ListItem marginLeft={'1rem'}>big racket</ListItem>
      </UnorderedList>
    </>
  );
}
