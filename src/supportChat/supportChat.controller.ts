import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { SupportRequestService } from './supportRequest.service';
import { Roles } from 'src/roles/roles.decorator';
import { SupportRequestClientService } from './supportRequestClient.service';
import type { GetChatListParamsDto, CreateSupportRequestDto } from './types/dto/supportChat';
import { type Request } from 'express';
import { type ID } from 'src/types/commonTypes';
import { SupportRequestEmployeeService } from './supportRequestEmployee.service';
import { RequestUser } from 'src/users/types/dto/users';
import { AuthenticatedGuard } from 'src/auth/guards/local.authenticated.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { UsersService } from 'src/users/users.service';
import { ClientIdCheckGuard } from './guards/clientCheck.guard';
import { SupportChatValidationPipe } from 'src/validation/supportChat.pipe';
import { sendMessageValidationSchema, supportSearchParamsValidationSchema } from 'src/validation/schemas/supportChat.joiSchema';
import { type GetChatListParams } from './types/supportChat';

@Controller("api")
export class SupportChatController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post("client/support-requests/")
  @Roles("client")
  createRequest(
    @Req() req: Request,
    @Body(new SupportChatValidationPipe(
      sendMessageValidationSchema
    )) body: { text: string }
  ) {
    const user = req.user as RequestUser;
    return this.supportRequestClientService.createSupportRequest({
      text: body.text,
      user: user.id,
    });
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get("client/support-requests/")
  @Roles("client")
  async getClientRequests(
    @Req() req: Request,
    @Query(new SupportChatValidationPipe(
      supportSearchParamsValidationSchema
    )) query: GetChatListParamsDto
    // @Query("limit") limit: number,
    // @Query("offset") offset: number,
    // @Query("isActive") isActive: boolean,
  ) {
    const user = req.user as RequestUser;
    const supportRequests = await this.supportRequestService.findSupportRequests({
      user: user.id,
      limit: query.limit,
      offset: query.offset,
      isActive: query.isActive,
    });
    const supportRequestsForResponse = await Promise.all(supportRequests.map(async (supportRequest) => {
      return {
        id: supportRequest.id,
        createdAt: supportRequest.createdAt,
        isActive: supportRequest.isActive,
        hasNewMessages: Boolean(
          (await this.supportRequestClientService.getUnreadCount(supportRequest.id)).length
        ),
      };
    }));

    return supportRequestsForResponse;
  }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get("manager/support-requests/")
  @Roles("manager")
  async getRequestsForManager(
    @Query("limit") limit: number,
    @Query("offset") offset: number,
    @Query("isActive") isActive: boolean,
  ) {
    const supportRequests = await this.supportRequestService.findSupportRequests({
      limit,
      offset,
      isActive,
    });
    const supportRequestsForResponse = await Promise.all(supportRequests.map(async (supportRequest) => {
      const clientData = await this.usersService.findById(supportRequest.user);

      return {
        id: supportRequest.id,
        createdAt: supportRequest.createdAt,
        isActive: supportRequest.isActive,
        hasNewMessages: Boolean(
          (await this.supportRequestClientService.getUnreadCount(supportRequest.id)).length
        ),
        client: {
          id: clientData?.id,
          name: clientData?.name,
          email: clientData?.email,
          contactPhone: clientData?.contactPhone,
        }
      };
    }));

    return supportRequestsForResponse;
  }

  @UseGuards(
    AuthenticatedGuard,
    RolesGuard,
    ClientIdCheckGuard
  )
  @Get("common/support-requests/:id/messages")
  @Roles("manager", "client")
  async getAllMessages(@Param("id") id: ID) {
    return this.supportRequestService.getMessages(id);
  }

  @UseGuards(
    AuthenticatedGuard,
    RolesGuard,
    ClientIdCheckGuard
  )
  @Post("common/support-requests/:id/messages")
  @Roles("manager", "client")
  async sendMessage(
    @Req() req: Request,
    @Body("text") text: string,
    @Param("id") id: ID,
  ) {
    const user = req.user as RequestUser;
    const authorName = await this.usersService.findById(user.id);
    const sentMessage = await this.supportRequestService.sendMessage({
      author: user.id,
      supportRequest: id,
      text,
    });

    return {
      id: sentMessage.id,
      createdAt: sentMessage.sentAt,
      text: sentMessage.text,
      readAt: sentMessage.readAt,
      author: {
        id: sentMessage.author,
        name: authorName?.name,
      },
    };
  }

  @UseGuards(
    AuthenticatedGuard,
    RolesGuard,
    ClientIdCheckGuard
  )
  @Post("common/support-requests/:id/messages/read")
  @Roles("manager", "client")
  async markAsRead(
    @Req() req: Request,
    @Body("createdBefore") createdBefore: Date,
    @Param("id") id: ID,
  ) {
    const user = req.user as RequestUser;
    const messageObject = {
      user: user.id,
      supportRequest: id,
      createdBefore,
    };

    if (user.role === "client") {
      await this.supportRequestClientService.markMessageAsRead(messageObject);
    } else {
      await this.supportRequestEmployeeService.markMessageAsRead(messageObject);
    }

    return { success: true };
  }
}
