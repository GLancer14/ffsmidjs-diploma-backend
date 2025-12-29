import { NestFactory } from '@nestjs/core';
import session from "express-session";
import passport from 'passport';
import cookieParser from "cookie-parser";
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './app.exceptionFilter';
import { InternalServerErrorException } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma/prisma.exceptionFilter';
import { SessionSocketIoAdapter } from './websocket/sessionSocketAuth.adapter';
import { SessionSerializer } from './auth/session.serializer';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (!process.env.SESSION_SECRET) {
    console.log("Отсутствует ключ сессии");
    throw new InternalServerErrorException("Отсутствует ключ сессии");
  }

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.log("Отсутствуют данные администратора");
    throw new InternalServerErrorException("Отсутствуют данные администратора");
  }

  const sessionSerializer = app.get(SessionSerializer);
  passport.serializeUser((user, done) => {
    sessionSerializer.serializeUser(user, done);
  })
  passport.deserializeUser((payload, done) => {
    sessionSerializer.deserializeUser(payload, done);
  })

  app.enableCors({
    origin: "http://localhost:5173",
    credentials: true,
  })

  app.use(cookieParser());
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 360000000,
    }
  });
  const passportInitialize = passport.initialize();
  const passportSession = passport.session();

  app.use(sessionMiddleware);
  app.use(passportInitialize);
  app.use(passportSession);

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new PrismaClientExceptionFilter()
  );
  app.useWebSocketAdapter(new SessionSocketIoAdapter(
    app,
    sessionMiddleware,
    passportInitialize,
    passportSession,
  ));

  const usersService = app.get(UsersService);
  
  usersService.upsertAdmin({
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    name: "администратор",
    contactPhone: "+79001234567",
    role: "admin",
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
