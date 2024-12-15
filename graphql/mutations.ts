import { gql } from '@apollo/client';

export const CREATE_CHATBOT = gql`
  mutation CreateChatBot(
    $name: String!
    $clerk_user_id: String!
    $created_at: DateTime!
  ) {
    insertChatbots(
      clerk_user_id: $clerk_user_id
      created_at: $created_at
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
  mutation AddCharacteristic(
    $chatbot_id: Int!
    $content: String!
    $created_at: DateTime!
  ) {
    insertChatbot_characteristics(
      chatbot_id: $chatbot_id
      content: $content
      created_at: $created_at
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

export const INSERT_MESSAGE = gql`
  mutation InsertMessage(
    $chat_session_id: Int!
    $content: String!
    $sender: String!
    $created_at: DateTime!
  ) {
    insertMessages(
      chat_session_id: $chat_session_id
      content: $content
      sender: $sender
      created_at: $created_at
    ) {
      id
      content
      created_at
      sender
    }
  }
`;

export const INSERT_GUEST = gql`
  mutation insertGuest(
    $name: String!
    $email: String!
    $created_at: DateTime!
  ) {
    insertGuests(name: $name, email: $email, created_at: $created_at) {
      id
    }
  }
`;

export const INSERT_CHAT_SESSION = gql`
  mutation insertChat_sessions(
    $guest_id: Int!
    $chatbot_id: Int!
    $created_at: DateTime!
  ) {
    insertChat_sessions(
      guest_id: $guest_id
      chatbot_id: $chatbot_id
      created_at: $created_at
    ) {
      id
    }
  }
`;
