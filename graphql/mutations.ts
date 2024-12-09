import { gql } from '@apollo/client';

export const CREATE_CHATBOT = gql`
      mutation CreateChatBot(
        $name: String!
        $clerk_user_id: String!
      ) {
        insertChatbots(
          clerk_user_id: $clerk_user_id
          created_at: "2024-12-09"
          name: $name
        ) {
          id
          name
        }
      }
`;
