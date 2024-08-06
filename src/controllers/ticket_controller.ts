import { Request, Response } from "express";
import Ticket, { ITicket } from "../models/ticket";
import Event, { EventStatus } from "../models/event";
import { notifyUsers } from "../utils/notification";
import User from "../models/user";
import mongoose from "mongoose";

export const purchaseTickets = async (req: Request, res: Response) => {
    const { userId, ticketIds } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId).session(session);
        if (!user) {
            throw new Error("User not found");
        }

        const tickets = await Ticket.find({
            _id: { $in: ticketIds },
            onSale: true,
        }).session(session);

        if (tickets.length !== ticketIds.length) {
            throw new Error("Some tickets are not available");
        }

        const updatePromises = tickets.map((ticket) =>
            Ticket.findByIdAndUpdate(
                ticket._id,
                { onSale: false, ownerId: userId, updatedAt: new Date() },
                { new: true, session }
            )
        );

        await Promise.all(updatePromises);

        const updatedTickets = await Ticket.find({
            _id: { $in: ticketIds },
        }).session(session);

        const eventIds = [
            ...new Set(tickets.map((ticket) => ticket.eventId.toString())),
        ];
        const eventUpdatePromises = eventIds.map((eventId) =>
            Event.findByIdAndUpdate(
                eventId,
                { $pull: { availableTicket: { $in: ticketIds } } },
                { new: true, session }
            )
        );

        await Promise.all(eventUpdatePromises);

        // Check if any event's available tickets list is now empty and update its status to SOLD_OUT
        const soldOutEventPromises = eventIds.map(async (eventId) => {
            const event = await Event.findById(eventId).session(session);
            if (event && event.availableTicket.length === 0) {
                event.status = EventStatus.SOLD_OUT;
                await event.save({ session });
            }
        });

        await Promise.all(soldOutEventPromises);

        user.tickets.push(...ticketIds);
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        res
            .status(200)
            .json({
                message: "Tickets purchased successfully",
                tickets: updatedTickets,
            });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Purchase failed", error: error.message });
    }
};

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
    const { barcode, position, originalPrice, resalePrice, ownerId, eventId, onSale } =
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
            onSale
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
        if (event.status === EventStatus.ON_SALE) {
            const updatedEvent = await event.updateOne({ $pull: { availableTicket: ticket._id } });
            // TODO: fix this logic
            if (updatedEvent && updatedEvent.availableTicket.length === 0) {
                updatedEvent.status = EventStatus.SOLD_OUT;
                await updatedEvent.save();
            }
        }
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

export const removeEventAvailableTickets = async (req, res) => {
    const { ticketId } = req.body;
    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        ticket.onSale = false;
        const updatedTicket = await ticket.save();

        if(!updateTicket) {
            res.status(400).json({ message: "Ticket removed from sale" });    
        }

        await updateEventAvailableTickets(updatedTicket)

        res.status(200).json({ message: "Ticket removed from sale" });
    } catch (error) {
        res.status(500).json({ message: "Error removing ticket from sale", error });
    }
};

export const updateTicketPrice = async (req, res) => {
    const { id } = req.params;
    const { resalePrice, onSale } = req.body;

    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            {
                resalePrice,
                onSale,
                updatedAt: new Date(),
            },
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        if (updatedTicket.onSale) {
            await updateEventAvailableTickets(updatedTicket)
        }

        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: "Error updating ticket price", error });
    }
};

export const removeTicketFromSale = async (req, res) => {
    const { id } = req.params;

    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        const event = await Event.findById(ticket.eventId);
        if (event) {
            await event.updateOne({ $pull: { availableTicket: ticket._id } });
        }

        ticket.onSale = false;
        await ticket.save();

        res.status(200).json({ message: "Ticket removed from sale" });
    } catch (error) {
        res.status(500).json({ message: "Error removing ticket from sale", error });
    }
};
