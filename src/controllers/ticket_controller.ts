import { Request, Response } from "express";
import Ticket, { ITicket } from "../models/ticket";
import Event, { EventStatus } from "../models/event";
import { notifyUsers } from "../utils/notification";
import User from "../models/user";

export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong getting the tickets" });
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findById({ _id: id });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong getting the ticket", error });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  const { barcode, position, originalPrice, resalePrice, ownerId, eventId } =
    req.body;
  try {
    const newTicket = new Ticket({
      barcode,
      position,
      originalPrice,
      resalePrice,
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId,
      eventId,
      onSale: true,
    });
    await newTicket.save();
    if (!newTicket) {
      console.log("no new ticket");

      return res.status(404).json({ message: "Ticket not found" });
    }
    console.log("ticket created");
    await updateEventAvailableTickets(newTicket);
    res.status(201).json(newTicket);

    const user = await User.findById(ownerId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.tickets.push(newTicket.id);
    await user.save();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong creating the ticket", error });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    barcode,
    position,
    originalPrice,
    resalePrice,
    ownerId,
    eventId,
    onSale,
  } = req.body;
  try {
    const currentTicket = await Ticket.findById(id);
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      {
        barcode,
        position,
        originalPrice,
        resalePrice,
        ownerId,
        updatedAt: new Date(),
        eventId,
        onSale,
      },
      { new: true }
    );
    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    if (currentTicket.onSale != updatedTicket.onSale) {
      await updateEventAvailableTickets(updatedTicket);
    }
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: "Error updating ticket", error });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedTicket = await Ticket.findByIdAndDelete({ _id: id });
    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ticket", error });
  }
};

export const updateEventAvailableTickets = async (ticket: ITicket) => {
  const event = await Event.findById(ticket.eventId);
  if (ticket.onSale) {
    if (event.status === EventStatus.SOLD_OUT) {
      await notifyUsers(event.id, event.name);
      await event.updateOne({
        $push: { availableTicket: ticket._id },
        status: EventStatus.ON_SALE,
      });
    } else {
      await event.updateOne({ $push: { availableTicket: ticket._id } });
    }
  } else {
    await event.updateOne({ $pull: { availableTicket: ticket._id } });
  }
};

// controllers/event.js
export const getEventsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const tickets = await Ticket.find({ ownerId: userId }).populate("eventId");
    const events = tickets.map((ticket) => ticket.eventId);
    console.log(events);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error getting events", error });
  }
};

export const getTicketCountByEventId = async (req: Request, res: Response) => {
  const { userId, eventId } = req.params;
  console.log(userId, eventId);
  try {
    const ticketCount = await Ticket.countDocuments({
      ownerId: userId,
      eventId: eventId,
    });
    res.json({ ticketCount });
  } catch (error) {
    console.error("Error fetching ticket count by event ID:", error);
    res.status(500).send("Server Error");
  }
};

export const getTicketsByUserAndEventId = async (
  req: Request,
  res: Response
) => {
  const { userId, eventId } = req.params;
  try {
    const user = await User.findById(userId).populate({
      path: "tickets",
      match: { eventId },
    });
    if (!user || !user.tickets || user.tickets.length === 0) {
      return res
        .status(404)
        .json({ message: "No tickets found for this event and user" });
    }
    res.status(200).json(user.tickets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tickets", error });
  }
};
