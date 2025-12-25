import { Injectable } from '@nestjs/common';
import { ISupportRequestEmployeeService } from './types/supportChat';
import { ID } from 'src/types/commonTypes';
import { MarkMessageAsReadDto } from './types/dto/supportChat';
import { Message } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SupportRequestEmployeeService implements ISupportRequestEmployeeService {
  constructor(private prisma: PrismaService) {}

  markMessageAsRead(params: MarkMessageAsReadDto) {
    return this.prisma.message.updateMany({
      where: {
        author: { not: params.user },
        supportRequestId: params.supportRequest,
        sentAt: {
          lt: new Date(params.createdBefore),
        },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      }
    });
  }

  getUnreadCount(supportRequest: ID): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        supportRequestId: supportRequest,
        readAt: {
          equals: null
        }
      }
    });
  }

  // async closeRequest(supportRequest: ID): Promise<void> {
  //   this.prisma.supportRequest.update({
  //     where: {
  //       id: supportRequest
  //     },
  //     data: {
  //       isActive: false
  //     }
  //   });
  // }
}
