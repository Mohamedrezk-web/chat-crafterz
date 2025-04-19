import mongoose, { Schema, Document } from 'mongoose';

export interface IChatbot extends Document {
  name: string;
  clerk_user_id: string;
  created_at: Date;
}

const ChatbotSchema = new Schema<IChatbot>(
  {
    name: {
      type: String,
      required: true,
    },
    clerk_user_id: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for chat sessions
ChatbotSchema.virtual('chat_sessions', {
  ref: 'ChatSession',
  localField: '_id',
  foreignField: 'chatbot_id',
});

// Virtual populate for characteristics
ChatbotSchema.virtual('characteristics', {
  ref: 'ChatbotCharacteristic',
  localField: '_id',
  foreignField: 'chatbot_id',
});

// Check if the model exists before creating it
const Chatbot =
  (mongoose.models?.Chatbot as mongoose.Model<IChatbot>) ||
  mongoose.model<IChatbot>('Chatbot', ChatbotSchema);

export default Chatbot;
