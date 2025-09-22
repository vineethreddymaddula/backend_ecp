import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import Order from '../models/order.model';
import crypto from 'crypto';
// import axios from 'axios'; // Commented out since Cashfree is disabled

// --- Cashfree Credentials & Environment --- (COMMENTED OUT)
// const cashfreeClientId = process.env.CASHFREE_APP_ID as string;
// const cashfreeClientSecret = process.env.CASHFREE_SECRET_KEY as string;
// const cashfreeBaseUrl = 'https://sandbox.cashfree.com/pg';

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
      // Amount is in Rupees from client, convert to Paise for Razorpay
      amount: Math.round(Number(amount) * 100), 
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const updatedOrder = await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: { id: razorpay_payment_id, status: 'success', update_time: new Date().toISOString() },
      }, { new: true });

      if (!updatedOrder) return res.status(404).json({ status: 'failure', message: 'Order not found' });
      res.status(200).json({ status: 'success', orderId });
    } else {
      res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error: Could not verify payment', error: error.message });
  }
};

// --- CASHFREE CONTROLLERS --- (COMMENTED OUT)
// export const createCashfreeOrder = async (req: Request, res: Response) => {
//   try {
//     const { amount, orderId, return_url } = req.body;
//     
//     const orderPayload = {
//       order_amount: Number(amount),
//       order_currency: "INR",
//       order_id: orderId,
//       customer_details: {
//         customer_id: req.user?._id.toString() || 'guest',
//         customer_email: req.user?.email || 'test@example.com',
//         customer_name: req.user?.name || 'Test User',
//         customer_phone: "9999999999",
//       },
//       order_meta: {
//         return_url: return_url,
//       }
//     };
//     
//     const response = await axios.post(`${cashfreeBaseUrl}/orders`, orderPayload, {
//       headers: {
//         'x-client-id': cashfreeClientId,
//         'x-client-secret': cashfreeClientSecret,
//         'x-api-version': '2022-09-01', // Using stable version
//         'Content-Type': 'application/json',
//       },
//     });
//     
//     res.status(200).json(response.data);
//   } catch (error: any) {
//     res.status(500).json({ message: 'Server Error: Could not create Cashfree order', error: error.response?.data });
//   }
// };

// export const verifyCashfreePayment = async (req: Request, res: Response) => {
//   try {
//     const { orderId } = req.params;
//     const response = await axios.get(`${cashfreeBaseUrl}/orders/${orderId}/payments`, {
//       headers: {
//         'x-client-id': cashfreeClientId,
//         'x-client-secret': cashfreeClientSecret,
//         'x-api-version': '2022-09-01',
//       },
//     });

//     const successfulPayment = response.data?.find((p: any) => p.payment_status === 'SUCCESS');

//     if (successfulPayment) {
//       const updatedOrder = await Order.findByIdAndUpdate(orderId, {
//         isPaid: true,
//         paidAt: new Date(),
//         paymentResult: { id: successfulPayment.cf_payment_id, status: successfulPayment.payment_status, update_time: successfulPayment.payment_time },
//       }, { new: true });
//       
//       if (!updatedOrder) return res.status(404).json({ status: 'failure', message: 'Order not found' });
//       res.status(200).json({ status: 'success', paymentInfo: successfulPayment });
//     } else {
//       res.status(400).json({ status: 'failure', message: 'Payment not successful' });
//     }
//   } catch (error: any) {
//     res.status(500).json({ message: 'Server Error: Could not verify payment', error: error.response?.data });
//   }
// };