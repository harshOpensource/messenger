"use client";

import clsx from "clsx";

import useConversation from "../hooks/useConversation";
import EmptyState from "../components/EmptyState";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";

const Home = () => {
  const { isOpen } = useConversation();

  return (
    <div
      className={clsx("lg:pl-80 h-full lg:block", isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
};

export default Home;
