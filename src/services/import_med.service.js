import { ValidationError, AppError, ConflictError, NotFoundError } from "../utilities/errors.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";
import { importMedModel } from "../models/import_med.model.js";

const getAllMedImport = async () => {
    try {
        return await importMedModel.getAllMedImport();
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(
        `Error in import_med service: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

const getImportById = async (id) => {
    try {
        return await importMedModel.getImportById(id);
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(
        `Error in import_med service: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

const getImportByDate = async (startDate, endDate) => {
    try {
        return await importMedModel.getImportByDate(startDate, endDate);
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(
        `Error in import_med service: ${error.message}`,
        HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
        );
    }
}

export const importMedService = {
    getAllMedImport,
    getImportById,
    getImportByDate,
}