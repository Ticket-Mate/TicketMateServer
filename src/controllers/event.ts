import { Request, Response } from "express";
import Event, { IEvent } from "../models/event";
import Ticket from "../models/ticket";

// Get all events
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error getting events", error });
  }
};

// Get event by ID
export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id).populate('availableTicket');
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error getting event", error });
  }
};

// Create a new event
export const createEvent = async (req: Request, res: Response) => {
  const {
    name,
    type,
    status,
    description,
    images,
    seatmap,
    startDate,
    endDate,
    availableTicket,
  } = req.body;

  try {
    const newEvent = new Event({
      name,
      type,
      images,
      seatmap,
      description,
      status,
      startDate,
      endDate,
      availableTicket,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
};

// Update an existing event
export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    type,
    status,
    description,
    images,
    seatmap,
    startDate,
    endDate,
    availableTicket,
  } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        name,
        type,
        status,
        description,
        images,
        seatmap,
        startDate,
        endDate,
        availableTicket,
        updatedAt: new Date(),
      },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error });
  }
};

export const getEventsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const tickets = await Ticket.find({ ownerId: userId }).populate("eventId");
    const eventMap = new Map<string, IEvent & { ticketCount: number }>();

    tickets.forEach((ticket) => {
      const event = ticket.eventId as unknown as IEvent;
      if (eventMap.has(event._id)) {
        eventMap.get(event._id)!.ticketCount += 1;
      } else {
        eventMap.set(event._id, { ...event, ticketCount: 1 });
      }
    });

    const events = Array.from(eventMap.values());
    console.log(events);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error getting events", error });
  }
};
