import mongoose, { Schema, Document } from 'mongoose';

export interface IChatSession extends Document {
  chatbot_id: mongoose.Types.ObjectId;
  guest_id?: mongoose.Types.ObjectId;
  created_at: Date;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    chatbot_id: {
      type: Schema.Types.ObjectId,
      ref: 'Chatbot',
      required: true,
    },
    guest_id: {
      type: Schema.Types.ObjectId,
      ref: 'Guest',
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

// Virtual populate for messages
ChatSessionSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chat_session_id',
});

// Virtual populate for chatbot
ChatSessionSchema.virtual('chatbot', {
  ref: 'Chatbot',
  localField: 'chatbot_id',
  foreignField: '_id',
  justOne: true,
});

// Virtual populate for guest
ChatSessionSchema.virtual('guest', {
  ref: 'Guest',
  localField: 'guest_id',
  foreignField: '_id',
  justOne: true,
});

// Check if the model exists before creating it
const ChatSession =
  (mongoose.models?.ChatSession as mongoose.Model<IChatSession>) ||
  mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);

export default ChatSession;
