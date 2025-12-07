import { NestFactory } from '@nestjs/core';
import session from "express-session";
import passport from 'passport';
import cookieParser from "cookie-parser";
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });

  app.use(
    session({
      secret: "process.env.SESSION_SECRET",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 360000000,
      }
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
