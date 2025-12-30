import { Injectable } from '@nestjs/common';
import { ISupportRequestService } from './types/supportChat';
import { ID } from 'src/types/commonTypes';
import { SendMessageDto } from './types/dto/supportChat';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message, SupportRequest } from 'src/generated/prisma/client';


export interface MessageForRequest {
  id: number;
  author: string | undefined;
  sentAt: Date;
  text: string;
  readAt: Date | null;
  supportRequestId: number;
}

export type SupportRequestWithMessages = SupportRequest & { messages: MessageForRequest[] };

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

  async findUserSupportRequestForManager(userId: ID): Promise<SupportRequest | null> {
    return this.prisma.supportRequest.findUnique({
      where: {
        user: userId,
      },
      include: {
        messages: {
          orderBy: {
            sentAt: "asc",
          },
          include: {
            users: {
              select: {
                name: true,
              }
            }
          }
        },
      }
    })
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    let supportRequest = await this.prisma.supportRequest.findUnique({
      where: { id: +data.supportRequest },
    });

    const createdMessage = await this.prisma.message.create({
      data: {
        author: data.author,
        sentAt: new Date(),
        text: data.text,
        supportRequestId: data.supportRequest,
      },
      include: {
        users: {
          select: {
            name: true,
          }
        }
      }
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
