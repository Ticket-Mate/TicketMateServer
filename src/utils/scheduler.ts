import cron from "node-cron";
import Event, { EventStatus } from "../models/event";
import logger from "./logger";

// Run this job every hour
export const scheduleEventStatusUpdate = () => {
  cron.schedule("0 * * * *", async () => {
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
    } catch (error) {
      logger.error("Error updating event statuses:", error);
    }
  });
};
