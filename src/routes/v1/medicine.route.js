import express from "express";
import { medicineController } from "../../controllers/medicine.controller.js";
import { medicineValidation } from "../../validations/medicine.validation.js";
import authenticateJWT from "../../middlewares/authenticateJWT.js";

const router = express.Router();

router.get("/check-stock",authenticateJWT, medicineController.checkStock);

router
  .route("/")
  .post(authenticateJWT, medicineController.createOrUpdateMed)
  .get(medicineController.getAllMed);

router
  .route("/:id")
  .put(authenticateJWT, medicineValidation.update, medicineController.update)
  .delete(authenticateJWT, medicineController.deleteMed)
  .get(medicineController.getMed);

// router.get("/sort-by-date", medicineController.sortByDate);
// router.get("/sort-by-category", medicineController.sortByCategory);


export const medicineRouter = router;
