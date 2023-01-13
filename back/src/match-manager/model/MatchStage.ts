export const MATCH_STAGES = [
  'AWAITING_PLAYERS',
  'PREPARATION',
  'ONGOING',
  'FINISHED',
  'CANCELED',
] as const;

type MatchStageTuple = typeof MATCH_STAGES;

export type MatchStage = MatchStageTuple[number];
