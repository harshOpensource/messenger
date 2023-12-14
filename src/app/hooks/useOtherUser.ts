import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "@/graphql-client/types";

const useOtherUser = async (
  conversation: FullConversationType | { users: any[] }
) => {
  const session = useSession();

  const otherUser = useMemo(async () => {
    const id = session.data?.user?.id;
    const currentUserEmail = session.data?.user?.id;

    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    );
    console.log(otherUser, `otherUser`);

    return otherUser[0];
  }, [session.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
