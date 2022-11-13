import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChannelsInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const id = (await this.usersService.getMe(request.headers['authorization']))
      .id;
    console.log(id);
    return next.handle().pipe(
      map((data) => {
        if (isArray(data)) {
          //   data.some((channel, i) => {
          //     if (
          //       channel.owner_id != id &&
          //       channel.type == 'PRIVATE' &&
          //       !channel.allowed_users.find((user) => user.id == id)
          //     )
          //       delete data[i];
          //   });

          //   data = data.filter((channel) => channel);

          data.map((channel) => {
            delete channel.password;
            if (channel.type == 'PUBLIC' || channel.type == 'PROTECTED')
              delete channel.allowed_users;
            channel.allowed_users?.map((user) => {
              delete user.tfa_enabled;
              delete user.tfa_secret;
            });
          });
          return data;
        }
        if (
          data.type == 'PRIVATE' &&
          data.owner_id != id &&
          data.allowed_users.find((users) => users.id != id)
        ) {
          {
            throw new ForbiddenException(
              `You don't have permission to view this channel`,
            );
          }
        }
        delete data.password;
        if (data.type == 'PUBLIC' || data.type == 'PROTECTED')
          delete data.allowed_users;
        data.allowed_users?.map((user) => {
          delete user.tfa_enabled;
          delete user.tfa_secret;
        });
        return data;
      }),
    );
  }
}
