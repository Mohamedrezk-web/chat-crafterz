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

export const GET_CHATBOTS_BY_USER_ID = gql`
  query GetChatBotsByUserId {
    chatbotsList {
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

export const GET_USER_CHATBOTS = gql`
  query GetUserChatBots {
    chatbotsList {
      id
      name
      chat_sessions {
        id
        created_at
        guests {
          name
          email
        }
      }
    }
  }
`;

export const GET_CHAT_SESSIONS_MESSAGES = gql`
  query GetChatSessionsMessages($id: Int!) {
    chat_sessions(id: $id) {
      id
      created_at
      messages {
        id
        content
        created_at
        sender
      }
      chatbots {
        name
      }
      guests {
        name
        email
      }
    }
  }
`;

export const GET_MESSAGE_BY_CHAT_SESSION_ID = gql`
  query GetMessageByChatSessionId($id: Int!) {
    messagesUsingMessages_chat_session_id_fkey(id: $id) {
      id
      content
      created_at
      sender
    }
  }
`;
