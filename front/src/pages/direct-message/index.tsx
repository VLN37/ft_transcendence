import { useSearchParams } from 'react-router-dom';
import DirectMessage from '../../components/DirectMessage/DirectMessage';
import DirectMessagesComponent from '../../components/DirectMessages/DirectMessages';

export default function DirectMessagePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  if (!searchParams.get('user')) return <DirectMessagesComponent />;
  return <DirectMessage />;
}
