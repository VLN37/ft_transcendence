import { AxiosInstance } from 'axios';
import { Message } from '../models/Message';
import { Socket } from 'socket.io-client';
import { iDirectMessage } from '../models/DirectMessage';
import { User } from '../models/User';
import api from './api';
import { Api } from './api';
import userStorage from './userStorage';
import { Channel } from '../models/Channel';
import { iDirectLastMessage } from '../models/DirectMessages';

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

  disconnect() {
    this.channelSocket?.disconnect();
  }

  async leave(id: number) {
    const response = await this.client.delete(`/channels/${id}/leave`, {});
    userStorage.updateUser();
    return response;
  }

  setChannelSocket(instance: Api) {
    this.channelSocket = instance.getChannelSocket();
  }

  setDMSocket(instance: Api) {
    this.dmSocket = instance.getDirectMessageSocket();
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
    userStorage.updateUser();
    console.log('callback registered');
    this.channelSocket?.on('join', (response: any) => {
      console.log('callback called');
      callback(response.data);
    });
  }

  unsubscribeJoin() {
    this.channelSocket?.off('join');
    this.channelSocket?.removeAllListeners();
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

  async getChannel(id: string): Promise<Channel> {
    const response = await this.client.get(`/channels/${id}`, {});
    // console.log(response.data);
    return response.data;
  }

  async getDirectMessages(id: string): Promise<iDirectMessage[]> {
    const response = await this.client.get(`/direct_messages/${id}`, {});
    // console.log(response.data);
    return response.data;
  }

  async getLastDirectMessages(): Promise<iDirectLastMessage[]> {
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

  subscribeFriendRequest(callback: any) {
    this.dmSocket?.on('friend_request', ((user: User) => {
      // console.log('callback called');
      callback(user);
    }))
    // console.log('callback registered');
  }

  unsubscribeFriendRequest() {
    // console.log('callback unregistered');
    this.dmSocket?.off('friend_request');
  }

  subscribeUserStatus(callback: any) {
    this.dmSocket?.on('user_status', (user: User) => {
      // console.log('callback called');
      callback(user)
    })
    // console.log('callback registered');
  }

  unsubscribeUserStatus() {
    // console.log('callback unregistered');
    this.dmSocket?.off('user_status');
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
