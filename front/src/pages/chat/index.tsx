import { useLocation } from 'react-router-dom';
import Chat from '../../components/Chat/Chat';

export default function ChatPage() {
  const location = useLocation();
  return <Chat {...location.state} />;
}
