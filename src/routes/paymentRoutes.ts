// src/routes/paymentRoutes.ts
import { Router } from 'express';
import {createPaymentIntent,handleSuccessfulPayment,sendSellerEmail } from '../controllers/paymentController';

const router = Router();

// // Route for Payment Intent
// router.post('/create-payment-intent', createPaymentIntent);

// Route for Checkout Session
router.post('/create-payment-intent', createPaymentIntent);
router.post('/handle-successful-payment', handleSuccessfulPayment);
router.post('/send-seller-email', sendSellerEmail);




export default router;
