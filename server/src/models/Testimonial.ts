import { Schema, model, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  meta: string;
  rating: number;
  text: string;
  published: boolean;
  translations?: Record<string, { name?: string; meta?: string; text?: string }>;
  createdAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true },
  meta: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  text: { type: String, required: true },
  published: { type: Boolean, default: true },
  translations: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

testimonialSchema.index({ published: 1, createdAt: -1 });

export const Testimonial = model<ITestimonial>('Testimonial', testimonialSchema);
