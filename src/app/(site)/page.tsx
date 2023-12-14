"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "@/app/images/logo.png";
import { Session } from "next-auth";
import AuthForm from "./components/AuthForm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
type Props = {};

function Auth({}: Props) {
  const session = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (session.data?.user?.email) {
      toast.loading("loading session!");
      setIsLoading(false);
      toast.dismiss();
      toast.success("Logging you In!");
      router.push("/conversations");
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className="
  flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          src={logo}
          alt="logo"
          height="48"
          width="48"
          className="mx-auto w-auto"
        />
        <div className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </div>
      </div>
      <AuthForm />
    </div>
  );
}

export default Auth;
