import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { SupportRequestService } from './supportRequest.service';
import { Roles } from 'src/roles/roles.decorator';
import { SupportRequestClientService } from './supportRequestClient.service';
import { type CreateSupportRequestDto } from './types/dto/supportChat';
import { type Request } from 'express';
import { type ID } from 'src/types/commonTypes';
import { SupportRequestEmployeeService } from './supportRequestEmployee.service';
import { RequestUser } from 'src/users/types/dto/users';

@Controller("api")
export class SupportChatController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  @Post("client/support-requests/")
  @Roles("client")
  createClientRequest(@Body() message: CreateSupportRequestDto) {
    return this.supportRequestClientService.createSupportRequest(message);
  }

  @Get("client/support-requests/")
  @Roles("client")
  getClientRequests(
    @Req() req: Request, 
    @Query("limit") limit: number,
    @Query("offset") offset: number,
    @Query("isActive") isActive: boolean,
  ) {
    const user = req.user as RequestUser;
    return this.supportRequestService.findSupportRequests({
      user: user.id || null,
      limit,
      offset,
      isActive,
    });
  }

  @Get("manager/support-requests/")
  @Roles("manager")
  getRequestsForManager(
    @Query("limit") limit: number,
    @Query("offset") offset: number,
    @Query("isActive") isActive: boolean,
  ) {
    return this.supportRequestService.findSupportRequests({
      user: null,
      limit,
      offset,
      isActive,
    });
  }

  @Get("common/support-requests/:id/messages")
  @Roles("manager", "client")
  getAllRequests(@Param("id") id: ID) {
    return this.supportRequestService.getMessages(id);
  }

  @Post("common/support-requests/:id/messages")
  @Roles("manager", "client")
  sendMessage(
    @Req() req: Request,
    @Body("text") text: string,
    @Param("id") id: ID,
  ) {
    const user = req.user as RequestUser;
    return this.supportRequestService.sendMessage({
      author: user.id,
      supportRequest: id,
      text,
    });
  }

  @Post("common/support-requests/:id/messages/read")
  @Roles("manager", "client")
  markAsRead(
    @Req() req: Request,
    @Body("createBefore") createdBefore: Date,
    @Param("id") id: ID,
  ) {
    const user = req.user as RequestUser;
    const messageObject = {
      user: user.id,
      supportRequest: id,
      createdBefore,
    };

    if (user.role === "client") {
      return this.supportRequestClientService.markMessageAsRead(messageObject);
    } else {
      return this.supportRequestEmployeeService.markMessageAsRead(messageObject);
    }
  }
}
