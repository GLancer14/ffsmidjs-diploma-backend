import { NestFactory } from '@nestjs/core';
import session from "express-session";
import passport from 'passport';
import cookieParser from "cookie-parser";
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './app.exceptionFilter';
import { InternalServerErrorException } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma/prisma.exceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (!process.env.SESSION_SECRET) {
    console.log("Отсутствует ключ сессии");
    throw new InternalServerErrorException("Отсутствует ключ сессии");
  }

  app.use(cookieParser());
  // app.enableCors({
  //   origin: "http://localhost:3000",
  //   credentials: true,
  // });

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 360000000,
      }
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new PrismaClientExceptionFilter()
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
