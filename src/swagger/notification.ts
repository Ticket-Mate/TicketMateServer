/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - userId
 *         - eventId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the notification
 *         userId:
 *           type: string
 *           description: The id of the user
 *         eventId:
 *           type: string
 *           description: The id of the event
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the notification was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the notification was last updated
 *       example:
 *         _id: 60e8c4f10b3c2b6fef9e1234
 *         userId: 60e8c4f10b3c2b6fef9e5678
 *         eventId: 60e8c4f10b3c2b6fef9e9101
 *         createdAt: 2021-07-09T00:00:00.000Z
 *         updatedAt: 2021-07-09T00:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: The notifications managing API
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Returns the list of all the notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: The list of the notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Get the notification by id
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The notification id
 *     responses:
 *       200:
 *         description: The notification description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: The notification was not found
 */

/**
 * @swagger
 * /notifications/user/{userId}:
 *   get:
 *     summary: Get notifications by user id
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The list of notifications for the user
 *         contents:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       404:
 *         description: The user was not found
 */

/**
 * @swagger
 * /notifications/event/{eventId}:
 *   get:
 *     summary: Get notifications by event id
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The event id
 *     responses:
 *       200:
 *         description: The list of notifications for the event
 *         contents:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       404:
 *         description: The event was not found
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: The notification was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /notifications/{id}:
 *   patch:
 *     summary: Update the notification by the id
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The notification id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       200:
 *         description: The notification was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: The notification was not found
 *       500:
 *         description: Some error happened
 */

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Remove the notification by id
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The notification id
 *     responses:
 *       200:
 *         description: The notification was deleted
 *       404:
 *         description: The notification was not found
 */
