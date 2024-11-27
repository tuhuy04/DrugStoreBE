import express from "express";
import authenticateJWT from "../../middlewares/authenticateJWT.js";
import { importMedController } from "../../controllers/import_med.controller.js";

const router = express.Router();

router
    .route("/date")
    .get(authenticateJWT, importMedController.getImportByDate);

router
    .route("/").
    get(authenticateJWT, importMedController.getAllMedImport);

router
    .route("/:id")
    .get(authenticateJWT, importMedController.getImportById);



export const importMedRouter = router;