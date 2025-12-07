import { NestFactory } from '@nestjs/core';
import session from "express-session";
import passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(
  //   session({
  //     secret: "process.env.SESSION_SECRET",
  //     resave: false,
  //     saveUninitialized: false,
  //   })
  // );
  // app.use(passport.initialize());
  // app.use(passport.session());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
