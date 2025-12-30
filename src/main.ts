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

  if (!process.env.CLIENT_URL) {
    console.log("Отсутствует адрес клиента");
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
    origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173", 
      "http://frontend:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
