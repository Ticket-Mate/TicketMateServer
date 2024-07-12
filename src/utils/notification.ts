import { Request, Response } from 'express';
import Ticket, { ITicket } from "../models/ticket"
import Event, { EventStatus } from '../models/event';
import Notification from '../models/notification';
import User from '../models/user'
import {Novu} from '@novu/node'


const novu = new Novu("2f850e9937d16a37252c7ec49f19c944");

// Function to get user IDs and send emails
export async function notifyUsers(eventId) {
    try {
        // Fetch notifications for the specific event
        const notifications = await Notification.find({ eventId });

        // Extract user IDs
        const userIds = notifications.map(notification => notification.userId);

        // Fetch user details (optional, if needed)
        const users = await User.find({ _id: { $in: userIds } });

        // Loop through each user ID and send email
        for (let user of users) {
            novu.trigger('ticketmate', {
                to: {
                  subscriberId: user.id,
                  email: user.email
                },
                payload: {firstName: user.firstName}
              });
        }

        console.log('Emails sent successfully');
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
}

