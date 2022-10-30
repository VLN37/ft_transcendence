export const MATCH_TYPES = ['CLASSIC', 'TURBO'] as const;

type MatchTypeTuple = typeof MATCH_TYPES;

export type MatchType = MatchTypeTuple[number];

export interface AppendToQueueDTO {
  type: MatchType;
}
