import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GameWindow from '../../components/GameWindow';
import { MatchApi } from '../../services/matchApi';

export default function MatchPage() {
  const { match_id } = useParams();
  const matchApi = new MatchApi();

  useEffect(() => {
    if (!match_id) {
      throw new Error('no match id to connect');
    }
    matchApi.connectToServer();
    matchApi.connectAsPlayer(match_id);
    console.log('connected');
  }, []);

  return (
    <div>
      <GameWindow />
    </div>
  );
}
