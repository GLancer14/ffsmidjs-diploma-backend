import { Injectable } from '@nestjs/common';
import { ISupportRequestClientService } from './types/supportChat';
import { ID } from 'src/types/commonTypes';
import { CreateSupportRequestDto, MarkMessageAsReadDto } from './types/dto/supportChat';
import { Message, SupportRequest } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SupportRequestClientService implements ISupportRequestClientService {
  constructor(private prisma: PrismaService) {}

  findClientSupportRequest(userId: ID): Promise<SupportRequest | null> {
    return this.prisma.supportRequest.findUnique({
      where: {
        user: userId,
      },
      include: {
        messages: {
          orderBy: {
            sentAt: "asc",
          }
        },
      }
    })
  }

  async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest> {
    const requestCreationTime = new Date();
    const savedRequest = await this.prisma.supportRequest.create({
      data: {
        user: data.user,
        createdAt: requestCreationTime,
        messages: {
          create: {
            author: data.user,
            sentAt: requestCreationTime,
            text: data.text,
          },
        }
      },
    });
    
    return savedRequest;
  }

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
      },
    });
  }

  getUnreadCount(supportRequest: ID): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        supportRequestId: supportRequest,
        readAt: {
          equals: null,
        }
      }
    });
  }
}
