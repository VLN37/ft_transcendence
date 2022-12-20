import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MatchManagerInterceptor implements NestInterceptor {
  constructor() {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        data.map((match) => {
          delete match.left_player.tfa_enabled;
          delete match.left_player.tfa_secret;
          delete match.right_player.tfa_enabled;
          delete match.right_player.tfa_secret;
        });
        return data;
      }),
    );
  }
}
