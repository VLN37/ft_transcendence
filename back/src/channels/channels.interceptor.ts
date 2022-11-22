import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from 'src/users/users.service';
import { ChannelsService } from './channels.service';

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
    return next.handle().pipe(
      map((data) => {
        if (
          data.type == 'PRIVATE' &&
          data.owner_id != id &&
          !data.allowed_users.find((channel_user) => channel_user.id == id)
        ) {
          throw new ForbiddenException(
            `You don't have permission to view this channel`,
          );
        }
        delete data.password;
        if (data.type == 'PUBLIC' || data.type == 'PROTECTED')
          delete data.allowed_users;
        data.allowed_users?.map((user) => {
          delete user.tfa_enabled;
          delete user.tfa_secret;
        });
        data.users?.map((user) => {
          delete user.tfa_enabled;
          delete user.tfa_secret;
        });
        return data;
      }),
    );
  }
}

@Injectable()
export class ChannelsGetAllInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const id = (await this.usersService.getMe(request.headers['authorization']))
      .id;
    return next.handle().pipe(
      map((data) => {
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
      }),
    );
  }
}

@Injectable()
export class ChannelsDeleteInterceptor implements NestInterceptor {
  constructor(
    private channelsService: ChannelsService,
    private usersService: UsersService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const id = (await this.usersService.getMe(request.headers['authorization']))
      .id;
    const channel_id = request.path.split('/')[2] || 0;
    const owner_id = (await this.channelsService.getOne(channel_id)).owner_id;
    if (owner_id != id) {
      throw new ForbiddenException(
        `You don't have permission to delete this channel`,
      );
    }
    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}

@Injectable()
export class ChannelsGetMessagesInterceptor implements NestInterceptor {
  constructor(
    private channelsService: ChannelsService,
    private usersService: UsersService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const id = (await this.usersService.getMe(request.headers['authorization']))
      .id;
    const channel_id = request.path.split('/')[2] || 0;
    const channel = await this.channelsService.getOne(channel_id);
    if (!channel.users.find((user) => user.id == id))
      throw new ForbiddenException(
        `You need to join first to get all channel messages`,
      );
    return next.handle().pipe(
      map((data) => {
        data.map((message) => {
          delete message.user.tfa_secret;
          delete message.user.tfa_enabled;
          delete message.channel.password;
        });
        return data;
      }),
    );
  }
}
