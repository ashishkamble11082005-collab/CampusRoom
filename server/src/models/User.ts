import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: 'Student' | 'Landlord' | 'Admin';
  phoneNumber?: string;
  kycStatus: 'none' | 'pending' | 'approved' | 'rejected';
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  role: { type: String, required: true, enum: ['Student', 'Landlord', 'Admin'], default: 'Student' },
  phoneNumber: { type: String, trim: true },
  kycStatus: { type: String, required: true, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  googleId: { type: String, unique: true, sparse: true }
}, { timestamps: true });

// Pre-save hook to hash password updates
UserSchema.pre<IUser>('save', async function (next) {
  const user = this;
  if (!user.isModified('passwordHash') || !user.passwordHash) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = model<IUser>('User', UserSchema);
