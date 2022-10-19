import { User } from '../models/User';

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

  removeUser() {
    localStorage.removeItem('user');
  }
}

export default new UserStorage();
