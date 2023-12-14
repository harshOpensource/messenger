import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/graphql-client/ApolloProvider";
import AuthContext from "./context/AuthContext";
import ToasterContext from "./context/ToasterContext";

export const metadata = {
  title: "Messenger",
  description: "Messenger Clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        <AuthContext>
          <ApolloWrapper>
            <ToasterContext />
            {children}
          </ApolloWrapper>
        </AuthContext>
      </body>
    </html>
  );
}
