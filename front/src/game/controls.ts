import p5Types from 'p5';
import { GameApi } from '../services/gameApi';
import { PlayerCommand } from './model/PlayerCommand';

export const handleKeyPress = (p5: p5Types, gameApi: GameApi) => {
  if (p5.keyCode == p5.UP_ARROW || p5.key.toLowerCase() == 'w') {
    gameApi.issueCommand(PlayerCommand.MOVE_UP);
  } else if (p5.keyCode == p5.DOWN_ARROW || p5.key.toLowerCase() == 's') {
    gameApi.issueCommand(PlayerCommand.MOVE_DOWN);
  }
};

export const handleKeyRelease = (p5: p5Types, gameApi: GameApi) => {
  if (p5.keyCode == p5.UP_ARROW || p5.key.toLowerCase() == 'w') {
    gameApi.issueCommand(PlayerCommand.STOP_MOVE_UP);
  } else if (p5.keyCode == p5.DOWN_ARROW || p5.key.toLowerCase() == 's') {
    gameApi.issueCommand(PlayerCommand.STOP_MOVE_DOWN);
  }
};
