import { gql } from "graphql-tag";

const messagesTypeDefs = gql`
  type User {
    id: String!
    name: String!
    email: String!
    image: String!
    hashedPassword: String!
    conversationIds: [String!]
    seenMessageIds: [String!]
  }

  scalar Date

  type Message {
    id: String!
    body: String!
    createdAt: String!
    senderId: String!
    conversationId: String!
    image: String
    seenIds: [String!]
  }

  type createMessageResponse {
    success: Boolean!
    error: String!
  }

  type getMessagesResponse {
    error: String!
    messages: [Message!]
  }

  type Query {
    getMessages(conversationId: String!): getMessagesResponse!
  }

  type Mutation {
    createMessage(
      body: String!
      image: String!
      conversationId: String!
    ): createMessageResponse!
  }
`!;

export default messagesTypeDefs;
