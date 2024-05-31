import { Request, Response } from 'express';
import Ticket from "../models/ticket"
import Event, { EventStatus } from '../models/event';
import Notification from '../models/notification';
import logger from '../utils/logger';

// Get all tickets

export const getTickets = async (req: Request, res: Response) => {
    try { 
        const tickets= await Ticket.find();
        res.status(200).json(tickets);
    }catch (error){
        res.status(500).json({message: 'Something went wrong getting the tickets'});
    }
}

// Get ticket by id

export const getTicketById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const ticket = await Ticket.findById({_id:id});
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong getting the ticket', error });
    }
};

// Create a new ticket
export const createTicket = async (req: Request, res: Response) => {
    const { barcode, position, originalPrice, resalePrice, ownerId,eventId } = req.body;
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
        });
        await newTicket.save();
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong creating the ticket', error });
    }
};

// Update an existing ticket
export const updateTicket = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { barcode, position, originalPrice, resalePrice, ownerId,eventId } = req.body;
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(
            id,
            {
                barcode,
                position,
                originalPrice,
                resalePrice,
                ownerId,
                updatedAt: new Date(),
                eventId
            },
            { new: true }
        );
        if (!updatedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket', error });
    }
}
// Delete an ticket
export const deleteTicket = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedTicket = await Ticket.findByIdAndDelete({_id:id});
        if (!deletedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ticket', error });
    }
};

export const checkAndTriggerNotification = async (eventId: string) => {
    const event = await Event.findById(eventId);

    if(event.status === EventStatus.SOLD_OUT) {
        const users = Notification.find({eventId}).populate('User');
        logger.info(users)
    }

}
