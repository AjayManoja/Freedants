import { Schema, model, Document, Types } from 'mongoose';

export interface ISubmission extends Document {
  competitionId: Types.ObjectId;
  userId: Types.ObjectId;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: 'submitted' | 'reviewed';
  submittedAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
  competitionId: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  fileName: String,
  fileSize: Number,
  mimeType: String,
  status: { type: String, enum: ['submitted', 'reviewed'], default: 'submitted' },
  submittedAt: { type: Date, default: Date.now },
});

submissionSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

export const Submission = model<ISubmission>('Submission', submissionSchema);
