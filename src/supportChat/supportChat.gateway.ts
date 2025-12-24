import { ConsoleLogger, Inject, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { SupportRequestService } from "./supportRequest.service";
import { Roles } from "src/roles/roles.decorator";
import { type ID } from "src/types/commonTypes";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Server, Socket } from "socket.io";
import { Message, SupportRequest } from "src/generated/prisma/client";
import { SocketSessionAuthGuard } from "./guards/socketSessionAuth.guard";

@WebSocketGateway({ cors: { origin: ["http://localhost:5173"] } })
export class SupportChatGateway {
  @WebSocketServer() server: Server;
  private userChatRooms = new Map<number, Set<number>>();
  private chatSubscribers = new Map<number, Set<string>>();

  constructor(
    @Inject(SupportRequestService) private supportRequestService: SupportRequestService,
  ) {
    this.supportRequestService.subscribe((supportRequest, message) => {
      this.handleNewMessage(supportRequest, message);
    });
  }

  async handleConnection(socket: Socket) {
    socket.emit("connected", `Socket connected id: ${socket.id}`);
  }

  private handleNewMessage(supportRequest: SupportRequest, message: Message) {
    const chatId = +supportRequest.id
    const subscribers = this.chatSubscribers.get(chatId);

    if (subscribers) {
      subscribers.forEach(socketId => {
        const socket = this.getSocketById(socketId);
        if (socket) {
          console.log(message)
          socket.emit("newMessage", {
            chatId,
            message,
          });
        }
      })
    }
  }

  private getSocketById(socketId: string): Socket | undefined {
    return this.server.sockets.sockets.get(socketId);
  }

  // @UseGuards(SocketSessionAuthGuard)
  @SubscribeMessage("subscribeToChat")
  // @Roles("manager", "client")
  async subcribeToChatNotifications(
    @ConnectedSocket() client: Socket,
    @MessageBody("chatId") chatId: ID,
  ) {
    client.join(`chat_${chatId}`);
    const userId = Number(client.handshake.query.userId);
    if (!userId) {
      throw new WsException("Неверный id пользователя для отмены подписки на оповещения");
    }

    if (!this.userChatRooms.has(userId)) {
      this.userChatRooms.set(userId, new Set());
    }
    this.userChatRooms.get(userId)?.add(chatId);
    
    if (!this.chatSubscribers.has(chatId)) {
      this.chatSubscribers.set(chatId, new Set());
    }
    this.chatSubscribers.get(chatId)?.add(client.id);

    console.log("user subscribed to chat", chatId)
  }

  @SubscribeMessage("unsubscribeToChat")
  @Roles("manager", "client")
  async unsubcribeToChatNotifications(
    @ConnectedSocket() client: Socket,
    @MessageBody("chatId") chatId: ID,
  ) {
    client.leave(`chat_${chatId}`);
    const userId = Number(client.handshake.query.userId);
    if (!userId) {
      throw new WsException("Неверный id пользователя для отмены подписки на оповещения");
    }

    // console.log("client id at unsubscribe process: ", client.id);
    // console.log("chat Id at unsubscribe: ", chatId);

    this.userChatRooms.get(userId)?.delete(chatId);
    this.chatSubscribers.get(chatId)?.delete(client.id);

    if (this.userChatRooms.get(userId)?.size === 0) {
      this.userChatRooms.delete(userId);
    }

    if (this.chatSubscribers.get(chatId)?.size === 0) {
      this.chatSubscribers.delete(chatId);
    }

    // console.log("chat subscriber after unsubscribe: ", this.chatSubscribers)
  }
 
  handleDisconnect() {

  }
}