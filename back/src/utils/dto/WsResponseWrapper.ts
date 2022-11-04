export type WsResponseWrapper<T> = {
  error: string;
  data: T;
};
