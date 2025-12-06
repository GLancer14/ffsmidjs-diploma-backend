import { Injectable } from '@nestjs/common';
import { ISupportRequestEmployeeService } from './types/supportChat';
import { ID } from 'src/types/commonTypes';
import { MarkMessageAsReadDto } from './types/dto/supportChat';
import { Message } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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
export class SupportRequestEmployeeService implements ISupportRequestEmployeeService {
  constructor(private prisma: PrismaService) {}

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

  async closeRequest(supportRequest: ID): Promise<void> {
    this.prisma.supportRequest.update({
      where: {
        id: supportRequest
      },
      data: {
        isActive: false
      }
    });
  }
}
