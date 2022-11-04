import { Container } from '@chakra-ui/react';
import { ChannelTable } from '../../components/ChannelTable/ChannelTable';

export default function CommunityPage() {
  return (
    <Container maxW="100%" maxHeight={'90vh'} overflowY={'auto'}>
      <ChannelTable />
    </Container>
  );
}
