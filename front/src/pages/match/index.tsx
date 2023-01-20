import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GameWindow from '../../components/GameWindow';
import { GameRules } from '../../game/model/GameRules';
import { Match } from '../../models/Match';
import { GameApi } from '../../services/gameApi';

export default function MatchPage() {
  const [rules, setRules] = useState<GameRules>();
  const toast = useToast();
  const navigate = useNavigate();

  const { match_id: _match_id } = useParams();

  if (!_match_id || _match_id === undefined) {
    throw new Error('no match id to connect');
  }

  const matchId = _match_id!;

  const [gameApi] = useState(new GameApi(matchId));
  const [matchInfo, setMatchInfo] = useState<Match>();
  const [error, setError] = useState<string>();
  // let playerSide: PlayerSide | null = null;

  // let matchApi: MatchApi = new MatchApi();

  useEffect(() => {
    async function loadGameRules() {
      const currentRules = await gameApi.getGameRules();
      gameApi.connectToServer();
      const matchInfo = await gameApi.getMatchInfo(matchId);
      if (matchInfo) {
        setMatchInfo(matchInfo);
      } else {
        toast({
          title: "Couldn't find match",
          status: 'warning',
          duration: 3000,
          description: 'Maybe it never happened',
        });
        navigate('/');
      }
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
        error ||
        'loading'}
    </div>
  );
}
