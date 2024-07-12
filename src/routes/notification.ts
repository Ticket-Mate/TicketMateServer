// notification_routes.ts
import { Router } from "express";
import {
  getNotifications,
  getNotificationsByUserId,
  getNotificationsByEventId,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
} from "../controllers/notification";

const router = Router();

// Define routes
router.get("/", getNotifications);
router.get("/user/:userId", getNotificationsByUserId);
router.get("/event/:eventId", getNotificationsByEventId);
router.get("/:id", getNotificationById);
router.post("/", createNotification);
router.patch("/:id", updateNotification);
router.delete("/:id", deleteNotification);

export default router;
