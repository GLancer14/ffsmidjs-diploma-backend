import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { SupportRequestService } from './supportRequest.service';
import { Roles } from 'src/roles/roles.decorator';
import { SupportRequestClientService } from './supportRequestClient.service';
import { type CreateSupportRequestDto } from './types/dto/supportChat';
import { type Request } from 'express';
import { type ID } from 'src/types/commonTypes';
import { SupportRequestEmployeeService } from './supportRequestEmployee.service';
import { RequestUser } from 'src/users/types/dto/users';
import { AuthenticatedGuard } from 'src/auth/guards/local.authenticated.guard';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller("api")
export class SupportChatController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post("client/support-requests/")
  @Roles("client")
  createClientRequest(
    @Req() req,
    @Body("text") text: string
  ) {
    return this.supportRequestClientService.createSupportRequest({
      text,
      user: req.user.id
    });
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
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
      user: user.id,
      limit,
      offset,
      isActive,
    });
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get("manager/support-requests/")
  @Roles("manager")
  getRequestsForManager(
    @Query("limit") limit: number,
    @Query("offset") offset: number,
    @Query("isActive") isActive: boolean,
  ) {
    return this.supportRequestService.findSupportRequests({
      limit,
      offset,
      isActive,
    });
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get("common/support-requests/:id/messages")
  @Roles("manager", "client")
  getAllMessages(@Param("id") id: ID) {
    return this.supportRequestService.getMessages(id);
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
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

  @UseGuards(AuthenticatedGuard, RolesGuard)
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
