import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByUserId,
} from "../controllers/event";

const router = express.Router();

// Get all events
router.get("/", getEvents);

// Get event by ID
router.get("/:id", getEventById);

// Get events by user ID
router.get("/user/:userId", getEventsByUserId);

// Create a new event
router.post("/", createEvent);

// Update an existing event
router.put("/:id", updateEvent);

// Delete an event
router.delete("/:id", deleteEvent);

export default router;
