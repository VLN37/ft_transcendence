import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DirectMessagesGetInterceptor implements NestInterceptor {
  constructor() {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data) => {
        data.map((message) => {
          delete message.sender.tfa_enabled;
          delete message.sender.tfa_secret;
          delete message.receiver.tfa_enabled;
          delete message.receiver.tfa_secret;
        });
        return data;
      }),
    );
  }
}
