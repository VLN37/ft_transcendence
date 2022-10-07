import {
  Injectable,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortytwoGuard extends AuthGuard('42') {
  //handle request/response
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const result = (await super.canActivate(context)) as boolean; // THIS MUST BE CALLED FIRST
    return result;
  }

  //handle errors
  handleRequest(err, user, info) {
    if (err || !user) {
      throw new BadRequestException();
    }
    return user;
  }
}
