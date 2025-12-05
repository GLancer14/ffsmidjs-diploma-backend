import { ID } from "src/types/commonTypes";
import { CreateSupportRequestDto, MarkMessageAsReadDto, SendMessageDto } from "./dto/supportChat";

export interface Message {
  author: number;
  sentAt: Date;
  text: string;
  readAt: Date;
}

export interface SupportRequest {
  id: number;
  user: number;
  createdAt: Date;
  messages: Message[];
  isActive: boolean;
}

export interface GetChatListParams {
  user: ID | null;
  limit: number;
  offset: number;
  isActive: boolean;
}

export interface ISupportRequestService {
  findSupportRequestById(id: ID): Promise<SupportRequest>;
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageDto): Promise<Message>;
  getMessages(supportRequest: ID): Promise<Message[]>;
  subscribe(handler: (supportRequest: SupportRequest, message: Message) => void): () => void;
}

export interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessageAsRead(params: MarkMessageAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
}

export interface ISupportRequestEmployeeService {
  markMessageAsRead(params: MarkMessageAsReadDto);
  getUnreadCount(supportRequest: ID): Promise<Message[]>;
  closeRequest(supportRequest: ID): Promise<void>;
}