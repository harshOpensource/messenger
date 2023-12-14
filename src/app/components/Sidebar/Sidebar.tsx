"use client";

import { useQuery } from "@apollo/client";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import UsersOperations from "@/graphql-client/operations/users";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

function Sidebar({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState(null);
  const session = useSession();

  const { data, error, loading } = useQuery<any>(
    UsersOperations.Query.getCurrentUser,
    {
      variables: {
        email: session?.data?.user?.email,
      },
    }
  );

  useEffect(() => {
    // Check if data is defined and has a currentUser property
    if (data && data.getCurrentUser && data.getCurrentUser.user) {
      setCurrentUser(data.getCurrentUser.user);
    }
  }, [data]);

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}

export default Sidebar;
