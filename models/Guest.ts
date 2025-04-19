import mongoose, { Schema, Document } from 'mongoose';

export interface IGuest extends Document {
  name: string;
  email: string;
  created_at: Date;
}

const GuestSchema = new Schema<IGuest>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
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
GuestSchema.virtual('chat_sessions', {
  ref: 'ChatSession',
  localField: '_id',
  foreignField: 'guest_id',
});

// Check if the model exists before creating it
const Guest =
  (mongoose.models?.Guest as mongoose.Model<IGuest>) ||
  mongoose.model<IGuest>('Guest', GuestSchema);

export default Guest;
