export class MemoryMatch {
  id: string;
  left_player: Express.User;
  right_player: Express.User;
  left_player_score?: number = 0;
  right_player_score?: number = 0;

  constructor(id: string, leftPlayer: Express.User, rightPlayer: Express.User) {
    this.id = id;
    this.left_player = leftPlayer;
    this.right_player = rightPlayer;
    this.left_player_score = 0;
    this.right_player_score = 0;
  }
}
