import { ID } from "src/types/commonTypes";

export interface CreateSupportRequestDto {
  user: ID;
  text: string;
}

export interface SendMessageDto {
  author: ID;
  supportRequest: ID;
  text: string;
}

export interface MarkMessageAsReadDto {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
}

export interface GetChatListParamsDto {
  currentUser: ID;
  user?: ID;
  limit?: number;
  offset?: number;
  isActive?: boolean;
}