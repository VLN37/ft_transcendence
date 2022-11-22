import { User } from '../models/User';
import api from './api';

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
    const response = await api.getUser('me');
    this.saveUser(response);
  }

  removeUser() {
    localStorage.removeItem('user');
  }
}

export default new UserStorage();
