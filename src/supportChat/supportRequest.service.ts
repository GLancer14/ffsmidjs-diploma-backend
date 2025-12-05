import { Injectable } from '@nestjs/common';
import { GetChatListParams, ISupportRequestService, Message, SupportRequest } from './types/supportChat';
import { ID } from 'src/types/commonTypes';
import { SendMessageDto } from './types/dto/supportChat';
import { EventEmitter2 } from '@nestjs/event-emitter';

const initialMessage: Message = {
  author: 0,
  sentAt: new Date,
  text: "",
  readAt: new Date,
}

const initalSupportRequest: SupportRequest = {
  id: 0,
  user: 0,
  createdAt: new Date,
  messages: [initialMessage],
  isActive: true,
}

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(private eventEmitter: EventEmitter2) {}

  findSupportRequestById(id: ID): Promise<SupportRequest> {
    return Promise.resolve(initalSupportRequest);
  }

  findSupportRequests(params: GetChatListParams) {
    return Promise.resolve([initalSupportRequest]);
  }

  sendMessage(data: SendMessageDto) {
    return Promise.resolve(initialMessage);
  }

  getMessages(supportRequest: ID): Promise<Message[]> {
    return Promise.resolve([initialMessage]);
  }

  subscribe(handler: (supportRequest: SupportRequest, message: Message) => void): () => void {
    return () => {
      
    }
  }
}
