export interface CreateUserVariables {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserData {
  createUser: {
    success: boolean;
    error: string;
  };
}

import { Conversation, Message, User } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
