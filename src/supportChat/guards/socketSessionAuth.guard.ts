import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class SocketSessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    
    const session = (client.request as any).session;
    
    console.log(session, " . . . ", client.data.user)

    if (!session || !session.user) {
      throw new WsException('Unauthorized: No valid session found');
    }
    
    client.data.user = session.user;
    
    console.log("WS guard works")

    return true;
  }
}