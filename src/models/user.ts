import mongoose, {ObjectId, Schema} from "mongoose";
import { ITicket } from "./ticket";

export interface IUser {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt:Date;
  updatedAt:Date;
  tickets?:Schema.Types.ObjectId[];
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
  firstName:{
    type: String,
    required: true,
  },
  lastName:{
    type: String,
    required: true,
  },
  phone:{
    type: String,
    required:true,
  },
  tickets:[{
    type: Schema.Types.ObjectId,
    ref:'Ticket'

  }],
  refreshTokens: {
    type: [String],
    required: false,
  },
  createdAt: {
   type: Date,
   required:true,
  },
  updatedAt: {
    type: Date,
   required:true,
  }

});

export default mongoose.model<IUser>("User", userSchema);
