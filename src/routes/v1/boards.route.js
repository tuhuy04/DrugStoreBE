import express from "express";
import { boardsValidation } from "../../validations/boards.validation.js";
import { boardsController } from "../../controllers/boards.controller.js";

const router = express.Router();

router.route("/").post(boardsValidation.createNew, boardsController.createNew);

router.route("/:id")
  .get(boardsController.getById);

export const boardsRouter = router;
