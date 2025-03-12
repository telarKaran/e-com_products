import express from "express";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "../controllers/productController";
// import multer from "multer";

import { currentUser, requireAuth } from "@shopmaster360/shared";
import { upload } from "../services/fileUploadService";

const router = express.Router();
router.get("/", getAllProductsController);
router.get("/:id", getProductByIdController);

router.post(
  "/",
  upload.single("image"),
  /* checkAdminRole, */ createProductController
);
router.put(
  "/:id",
  currentUser,
  requireAuth,
  /* checkAdminRole, */ updateProductController
);
router.delete(
  "/:id",
  currentUser,
  requireAuth,
  /* checkAdminRole, */ deleteProductController
);

export { router as productRouter };
