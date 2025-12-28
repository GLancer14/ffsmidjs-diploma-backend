import { Injectable } from '@nestjs/common';
import { GetChatListParams, ISupportRequestService } from './types/supportChat';
import { ID } from 'src/types/commonTypes';
import { GetChatListParamsDto, SendMessageDto } from './types/dto/supportChat';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
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

  // async findSupportRequests(params: GetChatListParamsDto): Promise<SupportRequestWithMessages[]> {
  //   const supportRequests = (await this.prisma.supportRequest.findMany({
  //     skip: params.offset,
  //     take: params.limit,
  //     where: {
  //       user: params.user,
  //     },
  //     include: {
  //       messages: {
  //         where: {
  //           author: params.user
  //         },
  //         orderBy: {
  //           sentAt: "asc",
  //         }
  //       },
  //     }
  //   }));

  //   const allMessages = supportRequests.flatMap(sr => sr.messages);
  //   const uniqueMessagesAuthors = new Set(allMessages.map(message => message.author));
    
  //   const authorsWithNames = await Promise.all(
  //     Array.from(uniqueMessagesAuthors).map(async (authorId) => {
  //       const user = await this.prisma.user.findUnique({
  //         where: { id: authorId },
  //       });
  //       return { id: authorId, name: user?.name || "" };
  //     })
  //   );

  //   const supportRequestsWithAuthorNames: SupportRequestWithMessages[] = supportRequests.map(supportRequest => {
  //     const messagesWithAuthorNames: MessageForRequest[] = supportRequest.messages.map(message => {
  //       const authorInfo = authorsWithNames.find(author => message.author === author.id);
  //       return {
  //         ...message,
  //         author: authorInfo?.name, 
  //       } as MessageForRequest;
  //     });

  //     return {
  //       ...supportRequest,
  //       messages: messagesWithAuthorNames,
  //     };
  //   });

  //   return supportRequestsWithAuthorNames;

    // const uniqueMessagesAuthors = new Set(supportChat.messages.map(message => message.author));
    // const authorsWithNames = await Promise.all(Array.from(uniqueMessagesAuthors).map(async (author) => {
    //   const user = await this.prisma.user.findUnique({
    //     where: { id: author },
    //   });
    //   return { id: author, name: user?.name || "" };
    // }));

    // const supportChatMessagesWithAuthorsNames = supportChat.messages.map(message => {
    //   return {
    //     ...message,
    //     author: authorsWithNames.find(author => message.author === author.id)?.name,
    //   };
    // });

    // supportChat.messages = supportChatMessagesWithAuthorsNames;
    // return supportChat;
  // }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    let supportRequest = await this.prisma.supportRequest.findUnique({
      where: { id: +data.supportRequest },
    });

    // if (!supportRequest) {
    //   const requestCreationTime = new Date();
    //   supportRequest = await this.prisma.supportRequest.create({
    //     data: {
    //       user: data.author,
    //       createdAt: requestCreationTime,
    //       messages: {
    //         create: {
    //           author: data.author,
    //           sentAt: requestCreationTime,
    //           text: data.text,
    //         },
    //       }
    //     },
    //   });
    // }

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
    // const authorName = await this.prisma.user.findUnique({
    //   where: { id: data.author },
    // });

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
