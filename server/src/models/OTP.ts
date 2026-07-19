import { Schema, model, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // Auto-deletes after 300 seconds (5 minutes)
});

export const OTP = model<IOTP>('OTP', OTPSchema);
