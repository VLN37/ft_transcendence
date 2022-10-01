import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';

export class FortytwoGuard extends AuthGuard('42') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    (request.headers['code'] as any) = request.query['code'];
    return super.canActivate(context);
  }
  constructor() {
    super();
  }
}
