import express from "express";
import { supplierController } from "../../controllers/supplier.controller.js";
import authenticateJWT from "../../middlewares/authenticateJWT.js";

const router = express.Router();

router
  .route("/")
  .post(authenticateJWT,supplierController.addSupplier)
  .get(supplierController.getAllSuppliers);

router
  .route("/:id")
  .put(authenticateJWT,supplierController.updateSupplier)
  .delete(authenticateJWT,supplierController.deleteSupplier)
  .get(supplierController.getSupplierById);

export const supplierRouter = router;