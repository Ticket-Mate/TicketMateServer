import { Request, Response } from 'express';
import Stripe from 'stripe';
import { sendReceiptByEmail,sendSellerReceiptEmail } from '../utils/notification';
import User from '../models/user';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
  const { amount, email } = req.body;

  try {
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
      receipt_email: email,
      description: 'Thanks for your purchase!',
    });

    console.log("Payment intent ID:",paymentIntent.id);
    
    // Send the client secret back to the client
    res.status(200).json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

    // Note: The actual payment processing and receipt URL generation 
    // will happen on the client side or through a webhook

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

// New function to handle successful payments (to be called by a webhook)
export const handleSuccessfulPayment = async (req: Request, res: Response): Promise<void> => {
  const { paymentIntentId, userId } = req.body;
  console.log("payment intent ID is: ",paymentIntentId);
  console.log("user ID is: ",userId);

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      const charges = await stripe.charges.list({
        payment_intent: paymentIntentId,
      });

      let receiptUrl = null;
      if (charges.data.length > 0) {
        receiptUrl = charges.data[0].receipt_url;
      }

      if (receiptUrl && paymentIntent.receipt_email) {
        await sendReceiptByEmail(paymentIntent.receipt_email, receiptUrl, userId);
      }
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
};

export const sendSellerEmail = async (req: Request, res: Response): Promise<void> => {
  const { userId, amountSold, commissionAmount, totalTransferred, tickets } = req.body;

  try {
    // Fetch seller information from the database
    const seller = await User.findById(userId);
    
    if (!seller) {
      res.status(404).json({ error: 'Seller not found' });
      return; // Add return here to prevent further execution
    }

    const sellerEmail = seller.email;

    // Prepare email content
    const emailContent = {
      userName: seller.firstName, // Assuming seller has a firstName field
      userEmail: sellerEmail,
      amountSold,
      commissionAmount,
      totalTransferred,
      tickets, // Include ticket details if needed in the email
    };

    // Send email to the seller
    await sendSellerReceiptEmail(sellerEmail, emailContent);

    res.status(200).json({ message: 'Email sent to seller' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

