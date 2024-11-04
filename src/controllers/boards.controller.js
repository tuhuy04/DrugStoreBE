import { boardsService } from "../services/boards.service.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";

const createNew = async (req, res) => {
  try {
    const result = await boardsService.createNew(req.body);
    res.status(HTTP_STATUS_CODE.OK).send({ result });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
      error: new Error(error).message
    });
  }
};

const getById = async (req, res) => {
  try {
    const boardId = req.params.id;
    const result = await boardsService.getById(boardId);
    res.status(HTTP_STATUS_CODE.OK).send({ result });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
      error: new Error(error).message
    });
  }
};

export const boardsController = {
  createNew,
  getById
};
