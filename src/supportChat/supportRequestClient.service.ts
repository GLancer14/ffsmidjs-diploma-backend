import { Injectable } from '@nestjs/common';
import { ISupportRequestClientService } from './types/supportChat';
import { ID } from 'src/types/commonTypes';
import { CreateSupportRequestDto, MarkMessageAsReadDto } from './types/dto/supportChat';
import { Message, SupportRequest } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupportRequestService } from './supportRequest.service';

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
export class SupportRequestClientService implements ISupportRequestClientService {
  constructor(
    private prisma: PrismaService,
    private supportRequest: SupportRequestService
  ) {}

  async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest> {
    const requestCreationTime = new Date();
    const savedRequest = await this.prisma.supportRequest.create({
      data: {
        user: data.user,
        createdAt: requestCreationTime,
        isActive: true,
      },
    });

    await this.prisma.message.create({
      data: {
        author: data.user,
        sentAt: requestCreationTime,
        text: data.text,
        supportRequestId: savedRequest.id
      }
    })
    
    return {
      id: savedRequest.id,
      createdAt: requestCreationTime,
      isActive: true,
      user: data.user,
    };
  }

  markMessageAsRead(params: MarkMessageAsReadDto) {
    return this.prisma.message.updateMany({
      where: {
        author: params.user,
        supportRequestId: params.supportRequest,
        sentAt: {
          lt: params.createdBefore
        }
      },
      data: {
        readAt: new Date()
      }
    });
  }

  getUnreadCount(supportRequest: ID): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        supportRequestId: supportRequest,
        readAt: {
          not: null
        }
      }
    });
  }
}
