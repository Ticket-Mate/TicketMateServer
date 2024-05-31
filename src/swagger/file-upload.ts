/**
 * @swagger
 * tags:
 *   name: File Upload
 *   description: File upload operations
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     tags:
 *       - File Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *               destination:
 *                 type: string
 *                 description: The destination where the file should be uploaded
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of the uploaded file
 */