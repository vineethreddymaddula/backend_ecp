import { Router } from 'express';
import { 
  createRazorpayOrder, 
  verifyRazorpayPayment, 
  // createCashfreeOrder, 
  // verifyCashfreePayment,
  
} from '../controllers/payment.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Razorpay Routes
router.post('/razorpay/create-order', protect, createRazorpayOrder); // <-- This line defines the route
router.post('/razorpay/verify-payment', protect, verifyRazorpayPayment);

// Cashfree Routes
// router.post('/cashfree/create-order', protect, createCashfreeOrder);
// router.get('/cashfree/verify/:orderId', protect, verifyCashfreePayment);



export default router;