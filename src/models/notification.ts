import mongoose, {ObjectId, Schema} from "mongoose";
import { IUser } from "./user";
import { ITicket } from "./ticket";
 
export interface INotification {
    _id:string,
    userId:Schema.Types.ObjectId,
    eventId:Schema.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
    
  }

  const notificationSchema = new mongoose.Schema<INotification>({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    eventId:{
        type:Schema.Types.ObjectId,
        ref:"Event",
        required:true,
    },

   createdAt:{
    type:Date,
    required:true
   },
   updatedAt:{
    type:Date,
    required:true,
   },
   
  });

  export default mongoose.model<INotification>("Event", notificationSchema);

  