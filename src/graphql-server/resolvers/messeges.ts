import { Conversation, PrismaClient, User } from "@prisma/client";
import { CreateUserResponse, getMessagesResponse } from "../types";

import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

const messegesResolvers = {
  Query: {
    getMessages: async function getMessages(
      _: any,
      args: {
        conversationId: string;
      }
    ): Promise<getMessagesResponse> {
      const { conversationId } = args;
      try {
        const messages = await prisma.message.findMany({
          where: {
            conversationId: conversationId,
          },
          include: {
            sender: true,
            seen: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        if (!messages) {
          return {
            error: "messages not found!",
          };
        }

        return {
          messages: messages,
        };
      } catch (error) {
        return {
          error: "Something went wrong, Try Again!",
        };
      }
    },
  },
  Mutation: {
    createMessage: async function createMessage(
      _: any,
      args: {
        body: string;
        image: string;
        conversationId: string;
      }
    ): Promise<any> {
      const { body, image, conversationId } = args;
      const session: any = await getServerSession(authOptions);
      try {
        const message = await prisma.message.create({
          include: {
            sender: true,
            seen: true,
          },
          data: {
            body: body,
            image: image,
            conversation: {
              connect: {
                id: conversationId,
              },
            },
            sender: {
              connect: {
                id: session?.user.id,
              },
            },
            seen: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });

        return {
          success: true,
        };
      } catch (error) {
        return {
          error: "Something went wrong, Try Again!",
        };
      }
    },
  },
};

export default messegesResolvers;
