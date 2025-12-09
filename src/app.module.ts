import { Module } from '@nestjs/common';
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ConfigModule } from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LibrariesModule } from './libraries/libraries.module';
import { BookRentalModule } from './bookRental/bookRental.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupportChatModule } from './supportChat/supportChat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    UsersModule,
    LibrariesModule,
    BookRentalModule,
    AuthModule,
    SupportChatModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
