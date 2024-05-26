/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - barcode
 *         - eventId
 *         - position
 *         - originalPrice
 *         - createdAt
 *         - updatedAt
 *         - ownerId
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the ticket
 *         barcode:
 *           type: string
 *           description: The barcode of the ticket
 *         eventId:
 *           type: string
 *           description: The ID of the event associated with the ticket
 *         position:
 *           type: string
 *           description: The position of the ticket
 *         originalPrice:
 *           type: number
 *           description: The original price of the ticket
 *         resalePrice:
 *           type: number
 *           description: The resale price of the ticket
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the ticket was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the ticket was last updated
 *         ownerId:
 *           type: string
 *           description: The ID of the user who owns the ticket
 *       example:
 *         _id: 60e8c4f10b3c2b6fef9e1234
 *         barcode: "ABC123456789"
 *         eventId: "60e8c4f10b3c2b6fef9e5678"
 *         position: "A1"
 *         originalPrice: 100.00
 *         resalePrice: 150.00
 *         createdAt: 2021-07-09T00:00:00.000Z
 *         updatedAt: 2021-07-09T00:00:00.000Z
 *         ownerId: "60e8c4f10b3c2b6fef9e9101"
 */

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: The tickets managing API
 */

/**
 * @swagger
 * /ticket:
 *   get:
 *     summary: Returns the list of all the tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: The list of the tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */

/**
 * @swagger
 * /ticket/{id}:
 *   get:
 *     summary: Get the ticket by id
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket id
 *     responses:
 *       200:
 *         description: The ticket description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: The ticket was not found
 */

/**
 * @swagger
 * /ticket:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       201:
 *         description: The ticket was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /ticket/{id}:
 *   put:
 *     summary: Update the ticket by the id
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: The ticket was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: The ticket was not found
 *       500:
 *         description: Some error happened
 */

/**
 * @swagger
 * /ticket/{id}:
 *   delete:
 *     summary: Remove the ticket by id
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket id
 *     responses:
 *       200:
 *         description: The ticket was deleted
 *       404:
 *         description: The ticket was not found
 */