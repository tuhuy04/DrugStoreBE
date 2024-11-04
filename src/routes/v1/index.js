import express from "express";
import { boardsRouter } from "./boards.route.js";
import { accessRouter } from "./access.route.js";

const router = express.Router();

router.use("/boards", boardsRouter);
router.use('/auth', accessRouter);

export const apiV1 = router;
