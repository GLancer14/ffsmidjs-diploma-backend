import { Injectable } from '@nestjs/common';
import { ISupportRequestEmployeeService, Message, SupportRequest } from './types/supportChat';
import { ID } from 'src/types/commonTypes';
import { MarkMessageAsReadDto } from './types/dto/supportChat';

const initialMessage: Message = {
  author: 0,
  sentAt: new Date,
  text: "",
  readAt: new Date,
}

const initalSupportRequest: SupportRequest = {
  user: 0,
  createdAt: new Date,
  messages: [initialMessage],
  isActive: true,
}

@Injectable()
export class SupportRequestEmployeeService implements ISupportRequestEmployeeService {
  markMessageAsRead(params: MarkMessageAsReadDto) {
    
  }

  getUnreadCount(supportRequest: ID): Promise<Message[]> {
    return Promise.resolve([initialMessage]);
  }

  closeRequest(supportRequest: ID): Promise<void> {
    return Promise.resolve();
  }
}
