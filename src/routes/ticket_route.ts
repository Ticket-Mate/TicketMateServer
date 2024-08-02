import express from 'express';
import { getTickets, getTicketById,createTicket,updateTicket,deleteTicket, getEventsByUserId } from '../controllers/ticket_controller';

const router = express.Router();


// Get all tickets
router.get('/', getTickets);

// Get event by ID
router.get('/:id', getTicketById);

// Create a new event
router.post('/', createTicket);

// Update an existing event
router.put('/:id', updateTicket);

// Delete an event
router.delete('/:id', deleteTicket);

// routes/event.js
router.get('/user/:userId', getEventsByUserId);


export default router;
