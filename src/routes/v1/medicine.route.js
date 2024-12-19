import express from "express";
import { medicineController } from "../../controllers/medicine.controller.js";
import { medicineValidation } from "../../validations/medicine.validation.js";
import authenticateJWT from "../../middlewares/authenticateJWT.js";
import {upload} from "../../middlewares/upload.js";
import checkAdmin from "../../middlewares/checkAdmin.js";


const router = express.Router();

router.get("/check-stock",authenticateJWT, checkAdmin, medicineController.checkStock);
router.get("/category/:category_name", medicineController.getMedByCategory);
router.get("/search", medicineController.getMedByName);
router
  .route("/")
  .post(authenticateJWT,checkAdmin, upload.single("image"), medicineController.createOrUpdateMed)
  .get(medicineController.getAllMed);

router
  .route("/:id")
  .put(authenticateJWT, upload.single("image"), medicineController.update)
  .delete(authenticateJWT, medicineController.deleteMed)
  .get(medicineController.getMed);



export const medicineRouter = router;
