import { Inject } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { SupportRequestService } from "./supportRequest.service";
import { Roles } from "src/roles/roles.decorator";
import { type ID } from "src/types/commonTypes";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { Socket } from "socket.io";

@WebSocketGateway()
export class SupportChatGateway {
  constructor(
    @Inject(SupportRequestService) private supportRequestService: SupportRequestService,
    private eventEmitter: EventEmitter2,
  ) {}

  @SubscribeMessage("subscribeToChat")
  @Roles("manager", "client")
  async subcribeToChatNotifications(
    @ConnectedSocket() client: Socket,
    @MessageBody("chatId") chatId: ID,
  ) {
    const subscribe = this.supportRequestService.subscribe((supportRequest, message) => {
      client.to(supportRequest.toString()).emit("subscribeToChat", {
        ...message,
      })
    })

    // this.eventEmitter.emit("subcribeToChat", this.supportRequestService.subscribe((supportRequest, message) => {
    //   client.to(supportRequest.toString()).emit("subscribeToChat", {
    //     ...message,
    //   })
    // }));
  }

  @OnEvent("sendMessage")
  sendMessage(payload) {
    const sendMessageBySocket = payload;
  }
}