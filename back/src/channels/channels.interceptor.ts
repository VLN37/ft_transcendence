import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ChannelsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        if (isArray(data)) {
          data.map((channel) => {
            delete channel.password;
            if (channel.type == 'PUBLIC' || channel.type == 'PROTECTED')
              delete channel.allowed_users;
            channel.allowed_users?.map((user) => {
              delete user.tfa_enabled;
              delete user.tfa_secret;
            });
          });
          return;
        }
        delete data.password;
        if (data.type == 'PUBLIC' || data.type == 'PROTECTED')
          delete data.allowed_users;
        data.allowed_users?.map((user) => {
          delete user.tfa_enabled;
          delete user.tfa_secret;
        });
      }),
    );
  }
}
