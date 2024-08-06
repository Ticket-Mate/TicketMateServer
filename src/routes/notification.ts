// notification_routes.ts
import { Router } from "express";
import {
  getNotifications,
  getNotificationsByUserId,
  getNotificationsByEventId,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  getInterestsEventsByUserId,
} from "../controllers/notification";

const router = Router();

router.get("/", getNotifications);
router.get("/user/:userId", getNotificationsByUserId);
router.get("/event/:eventId", getNotificationsByEventId);
router.get("/:id", getNotificationById);
router.patch("/:id", updateNotification);
router.post("/", createNotification);
router.delete('/:userId/:eventId', deleteNotification);
router.get("/interests/:userId", getInterestsEventsByUserId);

export default router;
