import { Module } from '@nestjs/common';
import { SupportChatController } from './supportChat.controller';
import { SupportRequestService } from './supportRequest.service';
import { SupportRequestClientService } from './supportRequestClient.service';
import { SupportRequestEmployeeService } from './supportRequestEmployee.service';

@Module({
  imports: [],
  controllers: [SupportChatController],
  providers: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
})
export class SupportChatModule {}
