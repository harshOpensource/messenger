import { gql } from "@apollo/client";

export default {
  Query: {
    getCurrentUser: gql`
      query getCurrentUser($email: String!) {
        getCurrentUser(email: $email) {
          user {
            id
            name
            email
            conversationIds
            seenMessageIds
          }
        }
      }
    `,

    getUsers: gql`
      query getUsers($email: String!) {
        getUsers(email: $email) {
          id
          name
          email
          conversationIds
          seenMessageIds
        }
      }
    `,
  },
  Mutation: {
    createUser: gql`
      mutation createUser($name: String!, $email: String!, $password: String!) {
        createUser(name: $name, email: $email, password: $password) {
          success
          error
        }
      }
    `,
  },
};
