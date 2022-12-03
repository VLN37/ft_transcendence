import { AxiosInstance } from "axios";
import { Message } from '../models/Message';
import { Socket } from "socket.io-client";
import { iDirectMessage } from "../models/DirectMessage";
import { User } from "../models/User";
import { Api, api } from "./api_index";
import userStorage from "./userStorage";

class ChatApi {
  private client: AxiosInstance;
  private channelSocket?: Socket;
  private dmSocket?: Socket;
  constructor(public _client: Api) {
    console.log('Creating chat api class instance');
    this.client = _client.getClient();
    this.channelSocket = _client.getChannelSocket();
    this.dmSocket = _client.getDirectMessageSocket();
  }

  subscribeDirectMessage(callback: any) {
    this.dmSocket?.on('chat', (message: iDirectMessage) => {
      const blocked = userStorage.getUser()?.blocked || [];
      if (blocked.length) {
        if (
          blocked.find((blocked_user) => message.sender.id == blocked_user.id)
        )
          return;
      }
      callback(message);
    });
  }

  unsubscribeMessage(callback: any) {
    this.channelSocket?.off('chat', callback);
  }

  unsubscribeDirectMessage(callback: any) {
    this.dmSocket?.off('chat', callback);
  }

  subscribeJoin(callback: any) {
    console.log('callback registered');
    this.channelSocket?.on('join', (response: any) => {
      console.log('callback called');
      callback(response.data);
    });
  }

  unsubscribeJoin(callback: any) {
    this.channelSocket?.off('join', callback);
  }

  subscribeLeave(callback: any) {
    console.log('callback registered');
    this.channelSocket?.on('leave', (response: any) => {
      console.log('callback called');
      callback(response.data);
    });
  }

  unsubscribeLeave(callback: any) {
    this.channelSocket?.off('leave', callback);
  }

  subscribeChannelDisconnect(callback: any) {
    console.log('callback registered');
    this.channelSocket?.on('disconnect', () => {
      console.log('callback called');
      callback();
    });
  }

  unsubscribeChannelDisconnect() {
    this.channelSocket?.off('disconnect');
  }

  async getChannelMessages(id: string): Promise<Message[]> {
    const response = await this.client.get(`/channels/${id}/messages`, {});
    // console.log(response.data);
    return response.data;
  }

  async getDirectMessages(id: string): Promise<iDirectMessage[]> {
    const response = await this.client.get(`/direct_messages/${id}`, {});
    // console.log(response.data);
    return response.data;
  }

  async getLastDirectMessages(): Promise<User[]> {
    const response = await this.client.get(`/direct_messages/last`, {});
    // console.log(response.data);
    return response.data;
  }

  sendMessage(data: any) {
    this.channelSocket?.emit('chat', data);
  }

  sendDirectMessage(data: any) {
    this.dmSocket?.emit('chat', data);
  }

  subscribeMessage(callback: any) {
    this.channelSocket?.on('chat', (message: Message) => {
      const blocked = userStorage.getUser()?.blocked || [];
      if (blocked.length) {
        if (blocked.find((blocked_user) => message.user.id == blocked_user.id))
          return;
      }
      callback(message);
    });
  }

}

export default new ChatApi(api);
