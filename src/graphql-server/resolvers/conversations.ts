import { Conversation, PrismaClient, User } from "@prisma/client";
import {
  CreateUserResponse,
  Members,
  createConversationsResponse,
  getConversationByIdResponse,
  getMessagesResponse,
} from "../types";

import bcrypt from "bcrypt";
import getSession from "../getSession";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/app/lib/pusher";

const prisma = new PrismaClient();

const conversationsResolvers = {
  Query: {
    getConversationById: async function getConversationById(
      _: any,
      args: {
        conversationId: string;
      }
    ): Promise<getConversationByIdResponse> {
      const { conversationId } = args;
      try {
        const res = await prisma.conversation.findUnique({
          where: {
            id: conversationId,
          },
          include: {
            users: true,
          },
        });

        if (!res) {
          return {
            error: "conversation not found!",
          };
        }

        return {
          conversation: res,
        };
      } catch (error) {
        return {
          error: "Something went wrong, Try Again!",
        };
      }
    },

    getConversations: async function getConversations(): Promise<
      Conversation[]
    > {
      try {
        const session: any = await getServerSession(authOptions);
        const currentUser = session.user;

        const user: any = await prisma.user.findUnique({
          where: {
            email: currentUser?.email,
          },
        });

        const id = user?.id;
        const conversations = await prisma.conversation.findMany({
          orderBy: {
            lastMessageAt: "desc",
          },
          where: {
            userIds: {
              has: id,
            },
          },
          include: {
            users: true,
            messages: {
              include: {
                sender: true,
                seen: true,
              },
            },
          },
        });

        return conversations;
      } catch (error) {
        return [];
      }
    },
  },
  Mutation: {
    createConversation: async function createConversation(
      _: any,
      args: {
        userId: string;
        isGroup: boolean;
        members: any[];
        name: string;
      }
    ): Promise<any> {
      const { userId, isGroup, members, name } = args;

      try {
        // Ensure the authOptions are correctly configured for your authentication setup
        const session: any = await getServerSession(authOptions);

        const currentUser = session.user;

        const user: any = await prisma.user.findUnique({
          where: {
            email: currentUser?.email,
          },
        });

        const id = user?.id;

        if (!currentUser?.email) {
          return {
            error: "Unauthorized. User not authenticated.",
          };
        }

        if (isGroup && (!members || members.length < 2 || !name)) {
          return {
            error: "Invalid data for group conversation.",
          };
        }

        if (isGroup) {
          const newConversation = await prisma.conversation.create({
            data: {
              name,
              isGroup,
              users: {
                connect: [
                  ...members.map((member: { value: string }) => ({
                    id: member.value,
                  })),
                  {
                    id: id,
                  },
                ],
              },
            },
            include: {
              users: true,
            },
          });

          // Update all connections with new conversation
          newConversation.users.forEach((user) => {
            if (user.email) {
              pusherServer.trigger(
                user.email,
                "conversation:new",
                newConversation
              );
            }
          });

          return {
            conversation: newConversation,
          };
        }

        const existingConversations = await prisma.conversation.findMany({
          where: {
            OR: [
              {
                userIds: {
                  equals: [id, userId],
                },
              },
              {
                userIds: {
                  equals: [userId, id],
                },
              },
            ],
          },
        });

        const singleConversation = existingConversations[0];

        if (singleConversation) {
          return {
            conversation: singleConversation,
          };
        }

        const newConversation = await prisma.conversation.create({
          data: {
            users: {
              connect: [
                {
                  id: id,
                },
                {
                  id: userId,
                },
              ],
            },
          },
          include: {
            users: true,
          },
        });

        // Update all connections with new conversation
        newConversation.users.map((user) => {
          if (user.email) {
            pusherServer.trigger(
              user.email,
              "conversation:new",
              newConversation
            );
          }

          return {
            conversation: newConversation,
          };
        });

        // ... (rest of your code for one-on-one conversations)
      } catch (error) {
        // Log more details about the error for debugging in development
        console.error("Error creating conversation:", error);
        return {
          error: "Something went wrong. Try again!",
        };
      }
    },
  },
};

export default conversationsResolvers;
