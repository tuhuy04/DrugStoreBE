import express from "express";
import { supplierController } from "../../controllers/supplier.controller.js";
// import { categoryValidation } from '../../validations/medicine_category.validation.js';
import authenticateJWT from "../../middlewares/authenticateJWT.js";

const router = express.Router();

router
  .route("/")
  // .post(authenticateJWT, medicineValidation.createNew, medicineController.createNew)
  .post(supplierController.addSupplier)
  .get(supplierController.getAllSuppliers);

router
  .route("/:id")
  // .put(authenticateJWT, medicineValidation.update,  medicineController.update)
  .put(supplierController.updateSupplier)
  // .delete(authenticateJWT, medicineController.deleteMed)
  .delete(supplierController.deleteSupplier)
  .get(supplierController.getSupplierById);

export const supplierRouter = router;