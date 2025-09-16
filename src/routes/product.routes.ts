// src/routes/product.routes.ts
import { Router } from 'express';
import { 
  createProduct, 
  getAllProducts, 
  getProductById,
  updateProduct,
  deleteProduct,
  createBulkProducts
} from '../controllers/product.controller';
import validateRequest from '../middlewares/validateRequest';
import { createBulkProductsSchema, createProductSchema, updateProductSchema } from '../utils/validationSchemas';
import { protect, admin } from '../middlewares/auth.middleware'; // <-- IMPORT MIDDLEWARE

const router = Router();

router.route('/')
  .get(getAllProducts)
  // Apply both protect and admin middleware. A user must be logged in AND be an admin.
  .post(protect, admin, validateRequest(createProductSchema), createProduct);
router.post('/bulk', protect, admin, validateRequest(createBulkProductsSchema), createBulkProducts);
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, validateRequest(updateProductSchema), updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;