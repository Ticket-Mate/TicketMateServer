import cron from "node-cron";
import Event, { EventStatus } from "../models/event";
import logger from "./logger";

// Run this job every minute
export const scheduleEventStatusUpdate = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

      // Find events that have passed their end date but are not yet marked as ended
      const eventsToEnd = await Event.find({
        endDate: { $lt: now },
        status: { $ne: EventStatus.ENDED },
      });

      if (eventsToEnd.length > 0) {
        // Update their status to "ENDED"
        await Promise.all(
          eventsToEnd.map((event) => {
            event.status = EventStatus.ENDED;
            return event.save();
          })
        );
        logger.info(`${eventsToEnd.length} events marked as ENDED.`);
      }

      // Find events that are starting within the next 2 hours but are not yet marked as "about to start"
      const eventsAboutToStart = await Event.find({
        startDate: { $gte: now, $lte: twoHoursFromNow },
        status: { $ne: EventStatus.ABOUT_TO_START },
      });

      if (eventsAboutToStart.length > 0) {
        // Update their status to "ABOUT_TO_START"
        await Promise.all(
          eventsAboutToStart.map((event) => {
            event.status = EventStatus.ABOUT_TO_START;
            return event.save();
          })
        );
        logger.info(`${eventsAboutToStart.length} events marked as ABOUT TO START.`);
      }

      // Find events that have started but not yet ended
      const eventsStarted = await Event.find({
        startDate: { $lte: now },
        endDate: { $gt: now },
        status: { $nin: [EventStatus.ENDED, EventStatus.STARTED] }, // Exclude events already marked as ended or started
      });

      if (eventsStarted.length > 0) {
        // Update their status to "STARTED"
        await Promise.all(
          eventsStarted.map((event) => {
            event.status = EventStatus.STARTED;
            return event.save();
          })
        );
        logger.info(`${eventsStarted.length} events marked as STARTED.`);
      }

      // Find events that start more than 2 hours from now
      const eventsMoreThanTwoHoursToStart = await Event.find({
        startDate: { $gt: twoHoursFromNow },
        status: { $ne: EventStatus.ENDED },
      });

      if (eventsMoreThanTwoHoursToStart.length > 0) {
        await Promise.all(
          eventsMoreThanTwoHoursToStart.map((event) => {
            if (event.availableTicket.length > 0) {
              // If there are available tickets, set status to "ON_SALE"
              event.status = EventStatus.ON_SALE;
            } else {
              // If no tickets available, set status to "SOLD_OUT"
              event.status = EventStatus.SOLD_OUT;
            }
            return event.save();
          })
        );
      }

    } catch (error) {
      logger.error("Error updating event statuses:", error);
    }
  });
};
