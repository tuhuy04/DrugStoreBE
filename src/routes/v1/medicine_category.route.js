import express from "express";
import { categoryController } from "../../controllers/medicine_category.controller.js";
// import { categoryValidation } from '../../validations/medicine_category.validation.js';
import authenticateJWT from "../../middlewares/authenticateJWT.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateJWT, categoryController.addCategory)
  .get(categoryController.getAllCategories);

router
  .route("/:id")
  .put(authenticateJWT,categoryController.updateCategory)
  .delete(authenticateJWT,categoryController.deleteCategory)
  .get(categoryController.getCategoryById);

export const categoryRouter = router;
