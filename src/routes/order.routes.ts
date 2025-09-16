import { Router } from 'express';
import { 
  addOrderItems, 
  getMyOrders, 
  getOrderById 
} from '../controllers/order.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Route for creating a new order (POST to the base URL)
router.route('/').post(protect, addOrderItems);

// --- THE FIX: This route MUST come before the '/:id' route ---
// Route for getting the logged-in user's orders
router.route('/myorders').get(protect, getMyOrders);

// Route for getting a single order by its ID
// This must be last so that '/myorders' is not treated as an ID.
router.route('/:id').get(protect, getOrderById);

export default router;