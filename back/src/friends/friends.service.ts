import { Injectable } from '@nestjs/common';

@Injectable()
export class FriendService {
  constructor() {}

  async get(id: number) {
	return ('kk');
  }
}
