import resolvers from "@/graphql-server/resolvers/index";
import typeDefs from "@/graphql-server/typeDefs/index";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer as subServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { NextRequest } from "next/server";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const httpServer = createServer();

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "api/graphql/subscriptions",
});

const serverCleanup = subServer(
  {
    schema,
  },
  wsServer
);

const apolloServer = new ApolloServer({
  schema,
  plugins: [
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

const handler = startServerAndCreateNextHandler<NextRequest>(apolloServer);

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
