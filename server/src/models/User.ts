import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  avatarUrl: string;
  referralCode: string;
  language: string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  avatarUrl: String,
  referralCode: { type: String, unique: true, required: true },
  language: { type: String, default: 'en' },
});

export const User = model<IUser>('User', userSchema);
