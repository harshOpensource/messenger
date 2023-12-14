"use client";

import Sidebar from "../components/Sidebar/Sidebar";
import { Conversation, User } from "@prisma/client";
import ConversationList from "./components/ConversationList";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import UsersOperations from "@/graphql-client/operations/users";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import ConversationOperations from "@/graphql-client/operations/conversations";

export default function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [users, setUsers] = useState<User[]>([] as User[]);
  const [conversations, setConversations] = useState<any[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data, error, loading } = useQuery<any>(
    UsersOperations.Query.getUsers,
    {
      variables: {
        email: session?.user?.email,
      },
    }
  );

  const {
    data: conversationData,
    error: conversationError,
    loading: conversationLoading,
  } = useQuery<any>(ConversationOperations.Query.getConversations);

  const {
    data: usersData,
    error: usersError,
    loading: usersLoading,
  } = useQuery(UsersOperations.Query.getUsers, {
    variables: {
      email: session?.user?.email,
    },
  });

  useEffect(() => {
    if (session?.user?.email && status === "authenticated") {
      if (usersData && usersData.getUsers && usersData.getUsers) {
        setUsers(usersData.getUsers);
      }
      if (
        conversationData &&
        conversationData.getConversations &&
        conversationData.getConversations
      ) {
        setConversations(conversationData.getConversations);
        console.log("conversations", conversationData.getConversations);
        console.log("final", conversations);
      }
    } else if (status !== "authenticated" && status !== "loading") {
      toast.dismiss();
      toast.error("Please Login to continue!");
      router.push("/");
    }

    console.log();
  }, [usersData, session, status, conversationData]);

  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList
          users={users}
          title="Messages"
          initialItems={conversations}
        />
        {children}
      </div>
    </Sidebar>
  );
}
