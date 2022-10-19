import axios, { AxiosHeaders } from 'axios';

interface AuthenticationResponse {
  access_token: string;
  token_type: string;
}

class Api {
  private client = axios.create({
    baseURL: 'http://localhost:3000',
  });

  constructor() {
    console.log('Criando uma instancia da classe de API');
  }

  async authenticate(code: string) {
    const response = await this.client.post<AuthenticationResponse>(
      '/auth/login',
      {
        code,
      },
    );

    if (response.status != 200) {
      throw new Error('Authentication failed');
    }

    return response.data.access_token;
  }

  setToken(token: string) {
    this.client.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  removeToken() {
    this.client.defaults.headers['Authorization'] = null;
  }
}

export default new Api();
