import mongoose, { Schema } from "mongoose";

export type Image = { 
    url: string
}

export enum EventStatus {
    SOLD_OUT='sold out',
    ON_SALE='on sale',
    UPCOMING='upcoming',
    CANCELLED= 'cancelled',
}

export interface IEvent {
    _id:string,
    name:string,
    description: string,
    status: EventStatus,
    type:string,
    images: Image[]
    seatmap: string,  
    startDate: Date,
    endDate: Date,
    createdAt: Date,
    updatedAt: Date, 
    availableTicket: Schema.Types.ObjectId[],
  }

  const eventSchema = new mongoose.Schema<IEvent>({
    name:{
        type:String,
        required:true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(EventStatus),
        required: true
    },
    type: {
        type:String,
        requires:true
    },
    startDate: {
        type: Date,
        requires:true
    },
    endDate: {
        type: Date,
        requires:true
    },
    images: [{
        url: {
            type: String,
            requires:true
        }
    }],
    seatmap: {
        type: String,
        requires:false
    },
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

  eventSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
  });

  export default mongoose.model<IEvent>("Event", eventSchema);

  