import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Socket } from 'socket.io';
import { createServer } from 'http';
import session from 'express-session';
import { RequestHandler } from 'express';
import { INestApplication } from '@nestjs/common';

export class SessionSocketIoAdapter extends IoAdapter {
  private sessionMiddleware: RequestHandler;
  private passportMiddleware: RequestHandler;
  private passportSessionMiddleware: RequestHandler;

  constructor(
    app: INestApplication,
    sessionMiddleware: RequestHandler,
    passportMiddleware: RequestHandler,
    passportSessionMiddleware: RequestHandler,
  ) {
    super(app);
    this.sessionMiddleware = sessionMiddleware;
    this.passportMiddleware = passportMiddleware;
    this.passportSessionMiddleware = passportSessionMiddleware;
  }

  create(port: number, options?: ServerOptions): any {
    const io = super.create(port, options);

    const wrap = (middleware: any) => {

      return (socket: Socket, next: (err?: Error) => void) => {
        const req = socket.request as any;
        const res = { end() {} } as any;

        return middleware(req, res, next);
      }
    }

    io.use(wrap(this.sessionMiddleware));
    io.use(wrap(this.passportMiddleware));
    io.use(wrap(this.passportSessionMiddleware));

    io.use((socket: Socket, next: any) => {
      const req = socket.request as any;
      // if ((socket.request as any).session && (socket.request as any).session.passport) {
      //   (socket.request as any).user = (socket.request as any).session.passport.user;
      // }
      if (req.user) {
        socket.data.user = req.user;
      }

      console.log("socket data: ")
      console.log(socket.data.user)
      next();
    });

    return io;
  }
}