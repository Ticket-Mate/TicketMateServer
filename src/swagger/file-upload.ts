
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
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: file
 *         in: formData
 *         required: true
 *         type: file
 *         description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         schema:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               description: URL of the uploaded file
 */