import Notification from '../models/notification';
import User from '../models/user'
import { Novu } from '@novu/node'
import logger from './logger';


const novu = new Novu(process.env.NOVU_API_KEY);

export async function notifyUsers(eventId) {
    try {
        logger.info('Going to send notification')
        const notifications = await Notification.find({ eventId });
        const userIds = notifications.map(notification => notification.userId);
        const users = await User.find({ _id: { $in: userIds } });

        for (let user of users) {
            novu.trigger('ticketmate', {
                to: {
                    subscriberId: user.id,
                    email: user.email
                },
                payload: { firstName: user.firstName }
            });
            logger.info(`notification was sent to ${user.email}`)
        }
    } catch (error) {
        logger.error('Error sending notifications:', error);
    }
}

