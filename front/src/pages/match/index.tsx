import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameWindow from '../../components/GameWindow';
import { GameRules } from '../../game/model/GameRules';
import { GameApi } from '../../services/gameApi';

export default function MatchPage() {
  const [rules, setRules] = useState<GameRules>();

  const { match_id } = useParams();

  if (!match_id) {
    throw new Error('no match id to connect');
  }

  const [matchApi] = useState(new GameApi());

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
      {(rules && <GameWindow gameApi={matchApi} rules={rules} />) || 'loading'}
    </div>
  );
}
