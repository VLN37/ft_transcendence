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
import { useNavigate } from 'react-router-dom';
import { Channel } from '../../models/Channel';
import Api from '../../services/api';

export function ChannelTable() {
  const [channelArr, setChannels] = useState<Channel[]>([]);
  let navigate = useNavigate();

  const redirect = (room: number) => {
    Api.connectToChannel(room.toString());
    navigate('/chat?id=' + room.toString());
  };

  useEffect(() => {
    Api.getChannels().then((channels) => setChannels(channels));
  }, []);

  return (
    <>
      <Input placeholder="Search channel room"/>
      <TableContainer overflowY={'scroll'} h={'100%'} maxHeight={'100%'} paddingBottom={'2rem'}>
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
                    <Button
                      onClick={() => redirect(channel.id)}
                      colorScheme={'blue'}
                      size={'lg'}
                    >
                      join
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
