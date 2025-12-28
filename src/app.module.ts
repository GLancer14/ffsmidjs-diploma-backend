import { Module } from '@nestjs/common';
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from './users/users.module';
import { LibrariesModule } from './libraries/libraries.module';
import { BookRentalModule } from './bookRental/bookRental.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupportChatModule } from './supportChat/supportChat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads", "images"),
      serveRoot: "/public/images",
      serveStaticOptions: {
        index: false,
        cacheControl: true,
        maxAge: 86400000,
      }
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    UsersModule,
    LibrariesModule,
    BookRentalModule,
    AuthModule,
    SupportChatModule,
    PrismaModule,
  ],
})
export class AppModule {}
