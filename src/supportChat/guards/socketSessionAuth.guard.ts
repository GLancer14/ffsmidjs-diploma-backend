import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class SocketSessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();
    const req = (client.request as any);
    if (!req.user) {
      throw new WsException('Unauthorized: No valid session found');
    }
    
    client.data.user = req.user;
    return true;
  }
}