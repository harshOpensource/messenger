import { gql } from "@apollo/client";

export interface MembersInput {
  label: string;
  value: string;
}

export default {
  Query: {
    getConversations: gql`
      query getConversations {
        getConversations {
          id
          createdAt
          lastMessageAt
          name
          isGroup
          messagesIds
          userIds
          users {
            id
            name
            email
          }
        }
      }
    `,
  },
  Mutation: {
    createConversation: gql`
      mutation createConversation(
        $userId: String!
        $isGroup: Boolean!
        $members: [MembersInput!]!
        $name: String!
      ) {
        createConversation(
          userId: $userId
          isGroup: $isGroup
          members: $members
          name: $name
        ) {
          createdAt
          lastMessageAt

          messagesIds
          userIds
        }
      }
    `,
  },
};
