/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - apiEventId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the event
 *         name:
 *           type: string
 *           description: The name of the event
 *         type:
 *           type: string
 *           description: The type of the event
 *         apiEventId:
 *           type: string
 *           description: The API event ID
 *         tickets:
 *           type: array
 *           items:
 *             type: string
 *           description: List of ticket IDs associated with the event
 *         availableTicket:
 *           type: array
 *           items:
 *             type: string
 *           description: List of available ticket IDs
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the event was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the event was last updated
 *       example:
 *         _id: 60e8c4f10b3c2b6fef9e1234
 *         name: Concert
 *         type: Music
 *         apiEventId: 12345
 *         tickets: [60e8c4f10b3c2b6fef9e5678]
 *         availableTicket: [60e8c4f10b3c2b6fef9e9101]
 *         createdAt: 2021-07-09T00:00:00.000Z
 *         updatedAt: 2021-07-09T00:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: The events managing API
 */

/**
 * @swagger
 * /event:
 *   get:
 *     summary: Returns the list of all the events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: The list of the events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     summary: Get the event by id
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The event id
 *     responses:
 *       200:
 *         description: The event description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: The event was not found
 */

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: The event was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /event/{id}:
 *   put:
 *     summary: Update the event by the id
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The event id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: The event was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: The event was not found
 *       500:
 *         description: Some error happened
 */

/**
 * @swagger
 * /event/{id}:
 *   delete:
 *     summary: Remove the event by id
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The event id
 *     responses:
 *       200:
 *         description: The event was deleted
 *       404:
 *         description: The event was not found
 */
