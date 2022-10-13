import axios from 'axios';

class Api {
  private token?: string;

  constructor(private readonly baseUrl = 'http://localhost:3000') {}

  async authenticate(code: string) {}
}

export default new Api();
