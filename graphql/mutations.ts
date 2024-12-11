import { gql } from '@apollo/client';

export const CREATE_CHATBOT = gql`
  mutation CreateChatBot($name: String!, $clerk_user_id: String!) {
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

export const UPDATE_CHATBOT = gql`
  mutation UpdateChatBot($id: Int!, $name: String!) {
    updateChatbots(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_CHATBOT = gql`
  mutation DeleteChatBot($id: Int!) {
    deleteChatbots(id: $id) {
      id
    }
  }
`;

export const ADD_CHARACTERISTIC = gql`
  mutation AddCharacteristic($chatbot_id: Int!, $content: String!) {
    insertChatbot_characteristics(
      chatbot_id: $chatbot_id
      content: $content
      created_at: "2024-12-09"
    ) {
      id
      content
      created_at
    }
  }
`;

export const REMOVE_CHARACTERISTIC = gql`
  mutation RemoveCharacteristic($id: Int!) {
    deleteChatbot_characteristics(id: $id) {
      id
    }
  }
`;
