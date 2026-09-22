import { Schema, model, Document, Types } from 'mongoose';

export interface IReferral extends Document {
  referrerId: Types.ObjectId;
  refereeId: Types.ObjectId;
  rewardAmount: number;
  createdAt: Date;
}

const referralSchema = new Schema<IReferral>({
  referrerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  refereeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rewardAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Referral = model<IReferral>('Referral', referralSchema);
