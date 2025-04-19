import { z } from 'zod';

export const chatbotSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  clerk_user_id: z.string().min(1, 'Clerk user ID is required').optional(),
});

export const chatSessionSchema = z.object({
  chatbot_id: z.string().min(1, 'Chatbot ID is required'),
  guest_id: z.string().optional(),
});

export const messageSchema = z.object({
  chat_session_id: z.string().min(1, 'Chat session ID is required'),
  content: z.string().min(1, 'Message content is required'),
  sender: z.string().min(1, 'Sender is required'),
});

export const guestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

export const chatbotCharacteristicSchema = z.object({
  chatbot_id: z.string().min(1, 'Chatbot ID is required'),
  content: z.string().min(1, 'Content is required'),
});
