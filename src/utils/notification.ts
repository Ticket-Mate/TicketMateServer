import Notification from "../models/notification";
import User from "../models/user";
import { Novu } from "@novu/node";
import logger from "./logger";


const novu = new Novu(process.env.NOVU_API_KEY);

export async function notifyUsers(eventId: string, eventName: string) {
  try {
    logger.info("Going to send notification");
    const notifications = await Notification.find({ eventId });
    const userIds = notifications.map((notification) => notification.userId);
    const users = await User.find({ _id: { $in: userIds } });

    for (const user of users) {
      novu.trigger("ticketmate", {
        to: {
          subscriberId: user.id,
          email: user.email,
        },
        payload: { firstName: user.firstName, eventName },
      });
      logger.info(`notification was sent to ${user.email}`);
    }
  } catch (error) {
    logger.error("Error sending notifications:", error);
  }
}


export async function sendReceiptByEmail(email: string, receiptUrl: string,userId: string) {
  try {
    logger.info(`Sending receipt to ${email}`);
    logger.info(`Receipt URL: ${receiptUrl}`);
    
    await novu.trigger("receipt", {
      to: {
        subscriberId: userId, 
        email: email,
      },
      payload: {
        payload: {
          receiptUrl: receiptUrl,
        },
      }
    });
    
    logger.info(`Receipt sent to ${email}`);
  } catch (error: any) {  // Catch any type of error
    logger.error("Error sending receipt:", error?.message || error);
    logger.error("Error details:", error);  // Log more detailed error info
  }
}

export async function sendSellerReceiptEmail(email: string, emailContent: any) {
  try {
    logger.info(`Sending seller receipt email to ${email}`);

    await novu.trigger("transferSeller", {
      to: {
        subscriberId: emailContent.userName, // Assuming you can use the user's name as the subscriber ID
        email: email,
      },
      payload: {
        userName: emailContent.userName,
        amountSold: emailContent.amountSold.toFixed(2),
        commissionAmount: emailContent.commissionAmount.toFixed(2),
        totalTransferred: emailContent.totalTransferred.toFixed(2),
        tickets: emailContent.tickets.map((ticket: any) => ({
          ticketId: ticket.ticketId,
          resalePrice: ticket.resalePrice?.toFixed(2),
        })),
      },
    });

    logger.info(`Seller receipt email sent to ${email}`);
  } catch (error) {
    logger.error("Error sending seller receipt email:", error);
    throw error;
  }
}
