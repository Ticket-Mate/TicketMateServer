import mongoose, { Schema } from "mongoose";

export interface IEvent {
    _id:string,
    name:string,
    type:string,
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

  