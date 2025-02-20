import express from 'express';
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from '../controllers/productController';
import multer from 'multer';

import { currentUser, requireAuth } from '@shopmaster360/shared'; 

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.get('/', getAllProductsController);
router.get('/:id', getProductByIdController);

router.post('/', currentUser, upload.single('image'), /* checkAdminRole, */ createProductController);
router.put('/:id', currentUser, requireAuth, /* checkAdminRole, */ updateProductController);
router.delete('/:id', currentUser, requireAuth, /* checkAdminRole, */ deleteProductController);

export { router as productRouter };
