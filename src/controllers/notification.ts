import { Request, Response } from "express";
import Notification from "../models/notification";
import Event, { EventStatus } from "../models/event";


export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find()
      .populate("userId")
      .populate("eventId");
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to get notifications", error });
  }
};

export const getNotificationsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId });
    res.status(200).json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get notifications for user", error });
  }
};

export const getNotificationsByEventId = async (
  req: Request,
  res: Response
) => {
  try {
    const { eventId } = req.params;
    const notifications = await Notification.find({ eventId }).populate(
      "userId"
    );
    const userIds = notifications.map((notification) => notification.userId);
    res.status(200).json(userIds);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get notifications for event", error });
  }
};

export const getInterestsEventsByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).populate("eventId");
    const events = notifications.map((notification) => notification.eventId);
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get notifications for event", error });
  }
};

export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id)
      .populate("userId")
      .populate("eventId");
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Failed to get notification", error });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { userId, eventId } = req.body;
    const event = await Event.findById(eventId);
    if (event.status !== EventStatus.SOLD_OUT) {
      return res.status(500).json({ message: "Event isn't sold out, registration failed" })
    }
    const newNotification = new Notification({
      userId,
      eventId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: "Failed to create notification", error });
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, eventId } = req.body;
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { userId, eventId, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification", error });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { userId, eventId } = req.params;
    const deletedNotification = await Notification.findOneAndDelete({ userId, eventId });

    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete notification", error });
  }
};