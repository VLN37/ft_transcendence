import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameWindow from '../../components/GameWindow';
import { GameRules } from '../../game/model/GameRules';
import { PlayerSide } from '../../game/model/Paddle';
import { Match } from '../../models/Match';
import { User } from '../../models/User';
import { GameApi } from '../../services/gameApi';
import userStorage from '../../services/userStorage';

const isPlayer = (user: User, match: Match) => {
  return user.id === match.left_player.id || user.id === match.right_player.id;
};

export default function MatchPage() {
  const [rules, setRules] = useState<GameRules>();

  const { match_id: _match_id } = useParams();

  if (!_match_id || _match_id === undefined) {
    throw new Error('no match id to connect');
  }

  const matchId = _match_id!;

  const [gameApi] = useState(new GameApi(matchId));
  const [playerSide, setPlayerSide] = useState<PlayerSide | null>(null);
  const [matchInfo, setMatchInfo] = useState<Match>();
  // let playerSide: PlayerSide | null = null;

  // let matchApi: MatchApi = new MatchApi();

  useEffect(() => {
    async function loadGameRules() {
      const currentRules = await gameApi.getGameRules();
      gameApi.connectToServer();
      const matchInfo = await gameApi.getMatchInfo(matchId);
      setMatchInfo(matchInfo);
      const user = userStorage.getUser()!;
      if (isPlayer(user, matchInfo)) {
        gameApi.connectAsPlayer();
        setPlayerSide(
          user.id === matchInfo.left_player.id
            ? PlayerSide.LEFT
            : PlayerSide.RIGHT,
        );
      } else {
        gameApi.connectAsSpectator();
      }
      setRules(currentRules);
    }
    loadGameRules();
  }, []);

  return (
    <div>
      {(rules && gameApi && matchInfo && (
        <GameWindow
          gameApi={gameApi}
          matchInfo={matchInfo}
          rules={rules}
          playerSide={playerSide}
        />
      )) ||
        'loading'}
    </div>
  );
}
