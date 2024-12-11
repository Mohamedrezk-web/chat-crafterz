import { gql } from '@apollo/client';

export const GET_CHATBOT_BY_ID = gql`
  query GetChatBotById($id: Int!) {
    chatbots(id: $id) {
      id
      name
      created_at
      chatbot_characteristics {
        id
        content
        created_at
      }
      chat_sessions {
        id
        guest_id
        created_at
        messages {
          id
          content
          created_at
        }
      }
    }
  }
`;
