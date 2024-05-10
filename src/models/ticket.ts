import mongoose, {ObjectId, Schema} from "mongoose";
import { IUser } from "./user";
import { IEvent } from "./event";
 
export interface ITicket {
    _id:string,
    barcode:string,
    eventId:IEvent,
    position: string,
    originalPrice: number,
    resalePrice?: number,
    createdAt: Date,
    updatedAt: Date
    ownerId: Schema.Types.ObjectId;
  }

  const ticketSchema = new mongoose.Schema<ITicket>({
    barcode: {
      type: String,
      required: true,
    },
    eventId: {
      type:Schema.Types.ObjectId,
      ref:"Event",
      required: true,
    },
    position:{
      type: String,
      required: true,
    },
    originalPrice:{
      type: Number,
      required: true,
    },
    resalePrice:{
      type: Number,
      
    },
    
    createdAt: {
     type: Date,
     required:true,
    },
    updatedAt: {
      type: Date,
     required:true,
    },
    ownerId:{
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
  
  });

  export default mongoose.model<ITicket>("Ticket", ticketSchema);

  