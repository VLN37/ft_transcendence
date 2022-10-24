import { LockIcon, UnlockIcon } from '@chakra-ui/icons';
import {
  TableContainer,
  Input,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Channel } from '../../models/Channel';
import Api from '../../services/api';

export function ChannelTable() {
  const [channelArr, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    Api.getChannels().then((channels) => setChannels(channels));
  }, []);

  return (
    <TableContainer>
      <Input placeholder="Search channel room" />
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>chat room</Th>
            <Th>visibility</Th>
            <Th>protected</Th>
            <Th>owner</Th>
            <Th>users</Th>
          </Tr>
        </Thead>
        <Tbody>
          {channelArr.map((channel) => {
            return (
              <Tr key={channel.id}>
                <Td>{channel.id}</Td>
                <Td>{channel.type}</Td>
                <Td>
                  {channel.type == 'PROTECTED' ? (
                    <LockIcon boxSize={'2rem'} />
                  ) : (
                    <UnlockIcon boxSize={'2rem'} />
                  )}
                </Td>
                <Td>{channel.owner_id}</Td>
                <Td>2</Td>
                <Td>
                  <Button colorScheme={'blue'} size={'lg'}>
                    join
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
