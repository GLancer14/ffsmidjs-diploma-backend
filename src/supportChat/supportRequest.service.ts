import { Injectable } from '@nestjs/common';
import { GetChatListParams, ISupportRequestService } from './types/supportChat';
import { ID } from 'src/types/commonTypes';
import { GetChatListParamsDto, SendMessageDto } from './types/dto/supportChat';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message, SupportRequest } from 'src/generated/prisma/client';

// const initialMessage: Message = {
//   author: 0,
//   sentAt: new Date,
//   text: "",
//   readAt: new Date,
// }

// const initalSupportRequest: SupportRequest = {
//   id: 0,
//   user: 0,
//   createdAt: new Date,
//   messages: [initialMessage],
//   isActive: true,
// }

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  constructor(
    private eventEmitter: EventEmitter2,
    private prisma: PrismaService,
  ) {}

  findSupportRequestById(id: ID): Promise<SupportRequest | null> {
    return this.prisma.supportRequest.findUnique({
      where: { id: +id },
    });
  }

  findSupportRequests(params: GetChatListParamsDto & { user?: number }): Promise<SupportRequest[]> {
    return this.prisma.supportRequest.findMany({
      skip: params.offset,
      take: params.limit,
      where: {
        user: params.user,
        isActive: params.isActive,
      },
    });
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    const createdMessage = await this.prisma.message.create({
      data: {
        author: data.author,
        sentAt: new Date(),
        text: data.text,
        supportRequestId: data.supportRequest,
      },
    });
    const authorName = await this.prisma.user.findUnique({
      where: { id: data.author },
    });
    const supportRequest = await this.prisma.supportRequest.findUnique({
      where: { id: +data.supportRequest },
    });

    this.eventEmitter.emit("message.created", {
      supportRequest,
      message: createdMessage,
    });
    
    return createdMessage;
  }

  getMessages(supportRequest: ID): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { supportRequestId: supportRequest },
      orderBy: { sentAt: "asc" },
    });
  }

  subscribe(handler: (supportRequest: SupportRequest, message: Message) => void): () => void {
    const listener = (({ supportRequest, message }: { supportRequest: SupportRequest, message: Message }) => {
      handler(supportRequest, message);
    });

    this.eventEmitter.on("message.created", listener);

    return () => {
      this.eventEmitter.off("message.created", listener);
    };
  }
}
