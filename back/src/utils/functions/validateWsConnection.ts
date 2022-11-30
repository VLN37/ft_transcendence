import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { TokenPayload } from 'src/auth/dto/TokenPayload';
import { UsersService } from 'src/users/users.service';

export async function validateWsJwt(
  usersService: UsersService,
  jwtService: JwtService,
  client: Socket,
) {
  const token = client.handshake.auth.token;
  try {
    const payload = jwtService.verify<TokenPayload>(token, {
      secret: process.env.JWT_SECRET,
    });
    const user = await usersService.findCompleteUserById(payload.sub);
    if (!user) throw new Error();
    return user;
  } catch {
    throw new WsException('Token invalid or expired');
  }
}
