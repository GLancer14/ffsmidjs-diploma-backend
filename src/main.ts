import { NestFactory } from '@nestjs/core';
import session from "express-session";
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: "process.env.SESSION_SECRET",
      resave: false,
      saveUninitialized: false,
    })
  )

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
