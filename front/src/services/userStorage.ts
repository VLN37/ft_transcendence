import { User } from '../models/User';
import { userApi } from './api_index';

class UserStorage {
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    return JSON.parse(userStr);
  }

  saveUser(user: User) {
    const userStr = JSON.stringify(user);
    localStorage.setItem('user', userStr);
  }

  async updateUser() {
    const response = await userApi.getUser('me');
    this.saveUser(response);
    return response;
  }

  removeUser() {
    localStorage.removeItem('user');
  }
}

export default new UserStorage();
