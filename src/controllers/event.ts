import { Request, Response } from "express";
import Event, { IEvent } from "../models/event";
import Ticket from "../models/ticket";

type EventQuery = {
    name?: object;
    type?: object;
}

export const getEvents = async (req: Request, res: Response) => {
    try {
        let query: EventQuery = {};

        const { q, type } = req.query;

        if (q) {
            query.name = { $regex: new RegExp(q as string, 'i') };
        }

        if (type) {
            const filterArray = (type as string).split(',').map(item => item.trim());
            query.type = { $in: filterArray };
        }

        const events = await Event.find(query);

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Error getting events", error });
    }
};

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
        performanceTime,
        availableTicket,
        location
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
            performanceTime,
            location,
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
        location,
        endDate,
        performanceTime,
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
                location,
                startDate,
                endDate,
                performanceTime,
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