import { gql } from "graphql-tag";

const userTypeDefs = gql`
  type User {
    id: String!
    name: String!
    email: String!
    image: String!
    hashedPassword: String!
    conversationIds: [String!]
    seenMessageIds: [String!]
  }

  type CreateUserResponse {
    success: Boolean
    error: String
  }

  type getUserResponse {
    success: Boolean!
    error: String!
    user: User!
  }

  type Query {
    getCurrentUser(email: String!): getUserResponse!
    getUsers(email: String!): [User!]!
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
    ): CreateUserResponse!
  }
`!;

export default userTypeDefs;
