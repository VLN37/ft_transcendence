import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameWindow, { GameRules } from '../../components/GameWindow';
import { MatchApi } from '../../services/matchApi';

export default function MatchPage() {
  const [rules, setRules] = useState<GameRules>();

  useEffect(() => {
    async function loadGameRules() {
      const currentRules = await matchApi.getGameRules();
      console.log('current rules', { currentRules });
      setRules(currentRules.data);
    }
    loadGameRules();
  }, []);
  const { match_id } = useParams();
  const matchApi = new MatchApi();

  if (!match_id) {
    throw new Error('no match id to connect');
  }
  matchApi.connectToServer();
  matchApi.connectAsPlayer(match_id);
  console.log('connected');

  return (
    <div>
      {(rules && <GameWindow matchApi={matchApi} rules={rules} />) || 'loading'}
    </div>
  );
}
