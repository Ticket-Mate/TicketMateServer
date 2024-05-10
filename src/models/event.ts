import mongoose, {ObjectId, Schema} from "mongoose";
import { IUser } from "./user";
import { ITicket } from "./ticket";
 
export interface IEvent {
    _id:string,
    name:string,
    type:string,
    apiEventId: string,
    tickets?:Schema.Types.ObjectId[];
    createdAt: Date,
    updatedAt: Date
    availableTicket?:Schema.Types.ObjectId[];
    
  }

  const eventSchema = new mongoose.Schema<IEvent>({
    name:{
        type:String,
        required:true,
    } ,
    type: {
        type:String,
        requires:true
    },
    apiEventId:{
        type:String,
        required:true
    } ,
    tickets: [{
        type: Object,
        ref: 'Ticket'
    }],
   createdAt:{
    type:Date,
    required:true
   },
   updatedAt:{
    type:Date,
    required:true,
   },
   availableTicket:[{
    type: Schema.ObjectId,
    ref: 'Ticket'
    
   }]

  
  });

  export default mongoose.model<IEvent>("Event", eventSchema);

  