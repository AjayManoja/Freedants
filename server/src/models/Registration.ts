import { Schema, model, Document, Types } from 'mongoose';

export interface IRegistration extends Document {
  competitionId: Types.ObjectId;
  userId: Types.ObjectId;
  status: 'pending_payment' | 'confirmed' | 'cancelled';
  paymentId?: string;
  idempotencyKey?: string;
  createdAt: Date;
}

const registrationSchema = new Schema<IRegistration>({
  competitionId: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending_payment', 'confirmed', 'cancelled'], default: 'pending_payment' },
  paymentId: String,
  idempotencyKey: String,
  createdAt: { type: Date, default: Date.now },
});

registrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });
registrationSchema.index({ idempotencyKey: 1 });

export const Registration = model<IRegistration>('Registration', registrationSchema);
