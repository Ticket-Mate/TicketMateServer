import mongoose, { Schema } from "mongoose";

export type Image = {
  url: string;
};

export enum EventStatus {
  SOLD_OUT = "sold out",
  ON_SALE = "on sale",
  UPCOMING = "upcoming",
  CANCELLED = "cancelled",
  ENDED = "ended",
  ABOUT_TO_START = "about to start"
}

export interface IEvent {
  _id: string;
  name: string;
  description: string;
  status: EventStatus;
  type: string;
  images: Image[];
  seatmap: string;
  startDate: Date;
  endDate: Date;
  performanceTime: Date; // Changed to Date type
  createdAt: Date;
  updatedAt: Date;
  availableTicket: Schema.Types.ObjectId[];
  location: string;
}

const eventSchema = new mongoose.Schema<IEvent>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(EventStatus),
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  performanceTime: { // Changed to Date type
    type: Date,
    required: true,
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
    },
  ],
  seatmap: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  availableTicket: [
    {
      type: Schema.ObjectId,
      ref: "Ticket",
    },
  ],
  location: {
    type: String,
    required: false,
  },
});

eventSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IEvent>("Event", eventSchema);