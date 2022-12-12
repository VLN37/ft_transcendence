import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameWindow, { GameRules } from '../../components/GameWindow';
import { MatchApi } from '../../services/matchApi';

export default function MatchPage() {
  const [rules, setRules] = useState<GameRules>();

  const { match_id } = useParams();

  if (!match_id) {
    throw new Error('no match id to connect');
  }

  const [matchApi] = useState(new MatchApi());

  // let matchApi: MatchApi = new MatchApi();

  useEffect(() => {
    async function loadGameRules() {
      const currentRules = await matchApi.getGameRules();
      console.log('rendering match page');
      matchApi.connectToServer();
      console.log('match id: ' + match_id);
      matchApi.connectAsPlayer(match_id!);
      setRules(currentRules.data);
    }
    loadGameRules();
  }, []);

  return (
    <div>
      {(rules && <GameWindow matchApi={matchApi} rules={rules} />) || 'loading'}
    </div>
  );
}
