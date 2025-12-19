import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  characters: mongoose.Types.ObjectId[]; // References created characters
  chats: mongoose.Types.ObjectId[]; // References active chats
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    characters: [{ type: Schema.Types.ObjectId, ref: 'Character' }],
    chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
  },
  { timestamps: true }
);

export default mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);
