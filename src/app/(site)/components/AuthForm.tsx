"use client";

import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import AuthSocialButton from "./SocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import Input from "@/app/components/Input/Input";
import Button from "@/app/components/Button";
import toast from "react-hot-toast";
import axios from "axios";
import { useMutation } from "@apollo/client";
import UserOperations from "@/graphql-client/operations/users";
import { CreateUserData, CreateUserVariables } from "@/graphql-client/types";

type Props = {};

type Varient = "login" | "register";

function AuthForm({}: Props) {
  const [varient, setVarient] = useState<Varient>("login");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const session = useSession();

  const toogleVarient = useCallback(() => {
    setVarient((prev) => (prev === "login" ? "register" : "login"));
  }, [varient]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const [createUser, { data, loading, error }] = useMutation<
    CreateUserData,
    CreateUserVariables
  >(UserOperations.Mutation.createUser);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (varient === "register") {
      toast.loading("Creating account...");
      try {
        const response: any = await createUser({
          variables: {
            name: data.name,
            email: data.email,
            password: data.password,
          },
        });

        if (response.data.createUser.success) {
          toast.dismiss();
          toast.success("Account created successfully!");
          await signIn("credentials", { ...data, redirect: false }).then(
            (callback) => {
              if (callback?.error) {
                toast.error("Invalid credentials!");
              }

              if (callback?.ok) {
                router.push("/conversations");
              }
            }
          );
        } else {
          if (response.data.createUser.error) {
            toast.dismiss();
            toast.error(response.data.createUser.error);
          } else {
            toast.dismiss();
            toast.error("Something went wrong!");
          }
        }

        setIsLoading(false);
      } catch (error) {
        toast.dismiss();
        toast.error("Something went wrong!");
      } finally {
        setIsLoading(false);
      }
    }

    if (varient === "login") {
      toast.loading("Logging in...");
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.dismiss();
            toast.error("Invalid credentials!");
          }

          if (callback?.ok) {
            toast.dismiss();
            toast.success("Logged in successfully!");
            router.push("/conversations");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials!");
        }

        if (callback?.ok) {
          router.push("/conversations");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {varient === "register" && (
            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id="name"
              label="Name"
            />
          )}
          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="email"
            label="Email Address"
            type="email"
          />
          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="password"
            label="Password"
            type="password"
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {varient === "login" ? "Sign in" : "register"}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div
              className="
                absolute 
                inset-0 
                flex 
                items-center
              "
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>
        <div
          className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
          "
        >
          <div>
            {varient === "login"
              ? "New to Messenger?"
              : "Already have an account?"}
          </div>
          <div onClick={toogleVarient} className="underline cursor-pointer">
            {varient === "login" ? "Create an account" : "login"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
