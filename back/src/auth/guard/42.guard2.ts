import {
  Injectable,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FortytwoLocalGuard extends AuthGuard('local') {
  //handle request/response
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const result = (await super.canActivate(context)) as boolean;
    (request.headers['token'] as any) = request.headers['authorization'];
    if (!request.headers['authorization']) return false;
    return result;
  }

  //handle errors
  handleRequest(err, user, info) {
    // if (err || !user) {
    //   throw new BadRequestException();
    // }
    return user;
  }
}
