import mongoose, { Schema, Document } from 'mongoose';

export interface IChatbotCharacteristic extends Document {
  chatbot_id: mongoose.Types.ObjectId;
  content: string;
  created_at: Date;
}

const ChatbotCharacteristicSchema = new Schema<IChatbotCharacteristic>(
  {
    chatbot_id: {
      type: Schema.Types.ObjectId,
      ref: 'Chatbot',
      required: true,
    },
    content: {
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

// Virtual populate for chatbot
ChatbotCharacteristicSchema.virtual('chatbot', {
  ref: 'Chatbot',
  localField: 'chatbot_id',
  foreignField: '_id',
  justOne: true,
});

// Check if the model exists before creating it
const ChatbotCharacteristic =
  (mongoose.models
    ?.ChatbotCharacteristic as mongoose.Model<IChatbotCharacteristic>) ||
  mongoose.model<IChatbotCharacteristic>(
    'ChatbotCharacteristic',
    ChatbotCharacteristicSchema
  );

export default ChatbotCharacteristic;
