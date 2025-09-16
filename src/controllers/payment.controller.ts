import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Cashfree } from 'cashfree-pg';

// --- Cashfree (will be used later) ---
// Cashfree.XClientId = process.env.CASHFREE_APP_ID as string;
// Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY as string;
// Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// --- Razorpay Initialization ---
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// --- RAZORPAY CONTROLLERS ---
export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error: Could not create Razorpay order', error: error.message });
  }
};

export const verifyRazorpayPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Signature is valid
      res.status(200).json({ status: 'success', orderId: razorpay_order_id });
    } else {
      res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error: Could not verify payment', error: error.message });
  }
};

// --- CASHFREE CONTROLLERS (for later) ---
export const createCashfreeOrder = async (req: Request, res: Response) => {
  // Logic for Cashfree will go here
};