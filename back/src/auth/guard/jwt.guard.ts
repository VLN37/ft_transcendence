import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const result = (await super.canActivate(context)) as boolean;
    if (!request.headers['authorization']) return false;
    const token = this.jwtService.decode(request.headers['authorization'].split(' ')[1]);
    // console.log(token);
    return result;
  }

  //handle errors
  handleRequest(err, user, info) {
    if (err) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
