import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMember extends Document {
  name: string;
  email: string;
  phone: string;
  country: string;
  passwordHash: string;
  status: 'pending' | 'active' | 'suspended';
  plan: string;
  invitedBy?: string;
  referralCode: string;
  referredBy?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended'],
      default: 'active',
    },
    plan: {
      type: String,
      default: '',
    },
    invitedBy: {
      type: String,
    },
    referralCode: {
      type: String,
      unique: true,
    },
    referredBy: {
      type: String,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
MemberSchema.index({ email: 1 });
MemberSchema.index({ referralCode: 1 });
MemberSchema.index({ status: 1 });
MemberSchema.index({ country: 1 });
MemberSchema.index({ createdAt: -1 });

const Member: Model<IMember> =
  mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);

export default Member;
