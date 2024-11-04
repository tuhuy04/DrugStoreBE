import { boardsModel } from "../models/boards.model.js";

const createNew = async (data) => {
  try {
    return await boardsModel.createNew(data);
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (boardId, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: Date.now()
    }
    return await boardsModel.update(boardId, updateData);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteById = async (boardId) => {
  try {
    const updateData = {
      _destroy: true,
      updatedAt: Date.now(),
      deletedAt: Date.now()
    }
    return await boardsModel.update(boardId, updateData);
  } catch (error) {
    throw new Error(error);
  }
};

const getById = async (boardId) => {
  try {
    return await boardsModel.getFullBoard(boardId);
  } catch (error) {
    throw new Error(error);
  }
}

export const boardsService = {
  createNew,
  update,
  deleteById,
  getById
};
