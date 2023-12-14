import { Conversation, Message, User } from "@prisma/client";

export interface CreateUserResponse {
  success?: boolean;
  error?: string;
}

export interface getUserResponse {
  error?: string;
  user?: User;
}

export interface getMessagesResponse {
  error?: string;
  messages?: Message[];
}

export interface getConversationByIdResponse {
  error?: string;
  conversation?: Conversation;
}

export interface createMessageResponse {
  success?: boolean;
  error?: string;
}

export interface createConversationsResponse {
  error?: string;
  conversation?: Conversation;
}

export interface Members {
  label?: string;
  value?: string;
}
