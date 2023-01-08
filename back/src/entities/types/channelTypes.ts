export const CHANNEL_TYPES = ['PUBLIC', 'PRIVATE', 'PROTECTED'];
type ChannelTypeTuple = typeof CHANNEL_TYPES;
export type ChannelType = ChannelTypeTuple[number];
