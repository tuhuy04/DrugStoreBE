import express from "express";
import { boardsRouter } from "./boards.route.js";
import { accessRouter } from "./access.route.js";
import { medicineRouter } from "./medicine.route.js";
import { categoryRouter } from "./medicine_category.route.js";
import { supplierRouter } from "./supplier.route.js";

const router = express.Router();

router.use("/boards", boardsRouter);
router.use('/auth', accessRouter);
router.use('/medicine', medicineRouter);
router.use('/category', categoryRouter);
router.use('/supplier', supplierRouter);

export const apiV1 = router;
