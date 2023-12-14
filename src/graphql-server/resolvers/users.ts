import { PrismaClient, User } from "@prisma/client";
import { CreateUserResponse, getUserResponse } from "../types";

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const userResolvers = {
  Query: {
    getCurrentUser: async function getCurrentUser(
      _: any,
      args: {
        email: string;
      }
    ): Promise<getUserResponse> {
      const { email } = args;
      try {
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user) {
          return {
            error: "User not found!",
          };
        }

        return {
          user: user,
        };
      } catch (error) {
        return {
          error: "Something went wrong, Try Again!",
        };
      }
    },

    getUsers: async function getUsers(
      _: any,
      args: {
        email: string;
      }
    ): Promise<User[]> {
      const { email } = args;
      try {
        const users = await prisma.user.findMany({
          orderBy: {
            createdAt: "desc",
          },
          where: {
            NOT: {
              email: email,
            },
          },
        });

        return users;
      } catch (error) {
        return [];
      }
    },
  },

  Mutation: {
    createUser: async function createUser(
      _: any,
      args: {
        name: string;
        email: string;
        password: string;
      }
    ): Promise<CreateUserResponse> {
      const { name, email, password } = args;

      try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user_find = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (user_find) {
          return {
            error: "User already exists!",
          };
        } else {
          const user = await prisma.user.create({
            data: {
              email,
              name,
              hashedPassword,
            },
          });

          return { success: true };
        }
      } catch (error) {
        return {
          error: "Something went wrong, Try Again!",
        };
      }
    },
  },
};

export default userResolvers;
