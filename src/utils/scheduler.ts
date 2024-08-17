import cron from "node-cron";
import Event, { EventStatus } from "../models/event";
import logger from "./logger";

// Run this job every hour
export const scheduleEventStatusUpdate = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      const now = new Date();

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
    } catch (error) {
      logger.error("Error updating event statuses:", error);
    }
  });
};
