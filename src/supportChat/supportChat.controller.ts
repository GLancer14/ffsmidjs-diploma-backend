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
import { markAsReadValidationSchema, sendMessageValidationSchema, supportSearchParamsValidationSchema } from 'src/validation/schemas/supportChat.joiSchema';
import { type GetChatListParams } from './types/supportChat';
import { idValidationSchema } from 'src/validation/schemas/common.joiSchema';

@Controller("api")
export class SupportChatController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthenticatedGuard)
  // @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post("client/support-requests/")
  // @Roles("client")
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
  async getClientRequestChat(
    @Req() req: Request,
  ) {
    const user = req.user as RequestUser;
    return await this.supportRequestClientService.findClientSupportRequest(user.id);
  }

  // @UseGuards(AuthenticatedGuard, RolesGuard)
  // @Get("client/support-requests/")
  // @Roles("client")
  // async getClientRequests(
  //   @Req() req: Request,
  //   @Query(new SupportChatValidationPipe(
  //     supportSearchParamsValidationSchema
  //   )) query: GetChatListParamsDto
  // ) {
  //   const user = req.user as RequestUser;
  //   const supportRequests = await this.supportRequestService.findSupportRequests({
  //     currentUser: user.id,
  //     limit: query.limit,
  //     offset: query.offset,
  //     isActive: query.isActive,
  //   });
  //   const supportRequestsForResponse = await Promise.all(supportRequests.map(async (supportRequest) => {
  //     return {
  //       id: supportRequest.id,
  //       createdAt: supportRequest.createdAt,
  //       hasNewMessages: Boolean(
  //         (await this.supportRequestClientService.getUnreadCount(supportRequest.id)).length
  //       ),
  //     };
  //   }));

  //   return supportRequestsForResponse;
  // }

  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get("manager/support-requests/")
  @Roles("admin", "manager")
  async getClientRequestForManager(
    @Req() req: Request,
    @Query(new SupportChatValidationPipe(
      supportSearchParamsValidationSchema
    )) query: GetChatListParamsDto
  ) {
    return await this.supportRequestService.findUserSupportRequestForManager(query.user);
  }

  // @UseGuards(AuthenticatedGuard, RolesGuard)
  // @Get("manager/support-requests/")
  // @Roles("admin", "manager")
  // async getRequestsForManager(
  //   @Req() req: Request,
  //   @Query(new SupportChatValidationPipe(
  //     supportSearchParamsValidationSchema
  //   )) query: GetChatListParamsDto
  // ) {
  //   const currentUser = req.user as RequestUser;
  //   const supportRequests = (await this.supportRequestService.findSupportRequests({
  //     currentUser: currentUser.id,
  //     user: query.user,
  //     limit: query.limit,
  //     offset: query.offset,
  //     // isActive: query.isActive,
  //   }))[0];

    // const supportRequestsForResponse = await Promise.all(supportRequests.map(async (supportRequest) => {
    //   const clientData = await this.usersService.findById(supportRequest.user);

    //   return {
    //     id: supportRequest.id,
    //     createdAt: supportRequest.createdAt,
    //     isActive: supportRequest.isActive,
    //     hasNewMessages: Boolean(
    //       (await this.supportRequestEmployeeService.getUnreadCount(supportRequest.id)).length
    //     ),
    //     messages: supportRequest.messages,
    //     client: {
    //       id: clientData?.id,
    //       name: clientData?.name,
    //       email: clientData?.email,
    //       contactPhone: clientData?.contactPhone,
    //     },
    //   };
    // }));

    // return supportRequests;
  // }

  @UseGuards(
    AuthenticatedGuard,
    RolesGuard,
    ClientIdCheckGuard
  )
  @Get("common/support-requests/:id/messages")
  @Roles("manager", "client")
  getAllMessages(@Param(
    new SupportChatValidationPipe(idValidationSchema)
  ) params: { id: ID }) {
    return this.supportRequestService.getMessages(params.id);
  }

  @UseGuards(
    AuthenticatedGuard,
    RolesGuard,
    ClientIdCheckGuard
  )
  @Post("common/support-requests/:id/messages")
  @Roles("admin", "manager", "client")
  async sendMessage(
    @Req() req: Request,
    @Body(
      new SupportChatValidationPipe(sendMessageValidationSchema)
    ) body: { text: string },
    @Param(
      new SupportChatValidationPipe(idValidationSchema)
    ) params: { id: ID },
  ) {
    const user = req.user as RequestUser;
    const authorName = await this.usersService.findById(user.id);
    const sentMessage = await this.supportRequestService.sendMessage({
      author: user.id,
      supportRequest: params.id,
      text: body.text,
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
    @Body(
      new SupportChatValidationPipe(markAsReadValidationSchema)
    ) body: { createdBefore: Date },
    @Param(
      new SupportChatValidationPipe(idValidationSchema)
    ) params: { id: ID },
  ) {
    const user = req.user as RequestUser;
    const messageObject = {
      user: user.id,
      supportRequest: params.id,
      createdBefore: body.createdBefore,
    };

    if (user.role === "client") {
      await this.supportRequestClientService.markMessageAsRead(messageObject);
    } else {
      await this.supportRequestEmployeeService.markMessageAsRead(messageObject);
    }

    return { success: true };
  }
}
