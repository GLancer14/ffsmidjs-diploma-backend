import { Module } from '@nestjs/common';
import { SupportChatController } from './supportChat.controller';
import { SupportRequestService } from './supportRequest.service';
import { SupportRequestClientService } from './supportRequestClient.service';
import { SupportRequestEmployeeService } from './supportRequestEmployee.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [],
  controllers: [SupportChatController],
  providers: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
    UsersService,
    PrismaService,
  ],
})
export class SupportChatModule {}
