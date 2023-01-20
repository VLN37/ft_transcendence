import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameWindow from '../../components/GameWindow';
import { GameRules } from '../../game/model/GameRules';
import { Match } from '../../models/Match';
import { GameApi } from '../../services/gameApi';

export default function MatchPage() {
  const [rules, setRules] = useState<GameRules>();

  const { match_id: _match_id } = useParams();

  if (!_match_id || _match_id === undefined) {
    throw new Error('no match id to connect');
  }

  const matchId = _match_id!;

  const [gameApi] = useState(new GameApi(matchId));
  const [matchInfo, setMatchInfo] = useState<Match>();
  // let playerSide: PlayerSide | null = null;

  // let matchApi: MatchApi = new MatchApi();

  useEffect(() => {
    async function loadGameRules() {
      const currentRules = await gameApi.getGameRules();
      gameApi.connectToServer();
      const matchInfo = await gameApi.getMatchInfo(matchId);
      setMatchInfo(matchInfo);
      setRules(currentRules);
    }
    loadGameRules();
  }, []);

  const images = [
    '/backgrounds/car-on-rain.jpg',
    '/backgrounds/bappie-L_rNhnpWkD0-unsplash.jpg',
  ];
  const rand = Math.floor(Math.random() * 2);

  return (
    <div
      style={{
        backgroundImage: `url(${images[rand]})`,
      }}
    >
      {(rules && gameApi && matchInfo && (
        <GameWindow gameApi={gameApi} matchInfo={matchInfo} rules={rules} />
      )) ||
        'loading'}
    </div>
  );
}
