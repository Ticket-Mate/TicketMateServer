import mongoose, { Schema } from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  tickets?: Schema.Types.ObjectId[];
  refreshTokens?: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  tickets: [{
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  refreshTokens: {
    type: [String],
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set default value to the current date
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Set default value to the current date
    required: true,
  }
});

export default mongoose.model<IUser>("Users", userSchema);
