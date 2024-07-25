import { Request, Response } from 'express';
import Ticket, { ITicket } from "../models/ticket"
import Event, { EventStatus } from '../models/event';
import Notification from '../models/notification';
import { notifyUsers } from '../utils/notification';
import logger from '../utils/logger';

export const getTickets = async (req: Request, res: Response) => {
    try {
        const tickets = await Ticket.find();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong getting the tickets' });
    }
}

export const getTicketById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const ticket = await Ticket.findById({ _id: id });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong getting the ticket', error });
    }
};

export const createTicket = async (req: Request, res: Response) => {
    const { barcode, position, originalPrice, resalePrice, ownerId, eventId } = req.body;
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
            
            return res.status(404).json({ message: 'Ticket not found' });
        }
        console.log("ticket created");
        await updateEventAvailableTickets(newTicket);
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong creating the ticket', error });
    }
};

export const updateTicket = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { barcode, position, originalPrice, resalePrice, ownerId, eventId, onSale } = req.body;
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
            return res.status(404).json({ message: 'Ticket not found' });
        }
        if (currentTicket.onSale != updatedTicket.onSale) {
            await updateEventAvailableTickets(updatedTicket);
        }
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket', error });
    }
}

export const deleteTicket = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedTicket = await Ticket.findByIdAndDelete({ _id: id });
        if (!deletedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ticket', error });
    }
};

export const updateEventAvailableTickets = async (ticket: ITicket) => {    
    
    const event = await Event.findById(ticket.eventId);
    if (ticket.onSale) {

        if (event.status === EventStatus.SOLD_OUT) {
            
            await notifyUsers(event.id, event.name)
            await event.updateOne({ $push: { availableTicket: ticket._id }, status: EventStatus.ON_SALE });
        }
        else {
            await event.updateOne({ $push: { availableTicket: ticket._id } });
        }
    } else {
        await event.updateOne({ $pull: { availableTicket: ticket._id } });
    }
}