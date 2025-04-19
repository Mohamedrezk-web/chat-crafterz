import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  chat_session_id: mongoose.Types.ObjectId;
  content: string;
  sender: string;
  created_at: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chat_session_id: {
      type: Schema.Types.ObjectId,
      ref: 'ChatSession',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sender: {
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

// Virtual populate for chat session
MessageSchema.virtual('chat_session', {
  ref: 'ChatSession',
  localField: 'chat_session_id',
  foreignField: '_id',
  justOne: true,
});

// Check if the model exists before creating it
const Message =
  (mongoose.models?.Message as mongoose.Model<IMessage>) ||
  mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
