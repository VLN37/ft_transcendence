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
    await api.getUser('me').then((user) => this.saveUser(user));
  }

  removeUser() {
    localStorage.removeItem('user');
  }
}

export default new UserStorage();
