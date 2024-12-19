import { supplierService } from "../services/supplier.service.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
  sendSuccessResponseWithCount,
} from "../helpers/response.helper.js";

const addSupplier = async (req, res) => {
  const { name, phone, email, location } = req.body;
  try {
    const result = await supplierService.addSupplier(req.body);
    sendSuccessResponse(res, result, HTTP_STATUS_CODE.CREATED);
  } catch (error) {
    console.error("Error in addSupplier:", error);
    sendErrorResponse(res, error);
  }
};

const updateSupplier = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const result = await supplierService.updateSupplier(id, data);
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in updateSupplier:", error);
    sendErrorResponse(res, error);
  }
};

const deleteSupplier = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await supplierService.deleteSupplier(id);
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in deleteSupplier:", error);
    sendErrorResponse(res, error);
  }
};

const getSupplierById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await supplierService.getSupplierById(id, data);
    sendSuccessResponse(res, result);
  } catch (error) {
    console.error("Error in getSupplierById:", error);
    sendErrorResponse(res, error);
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    const {keyword, id, page = 1, pageSize = 10} = req.query;
    const params = {
      keyword, 
      id: id ? parseInt(id, 10) : undefined,
      page: parseInt(page, 10),
      pageSize: parseInt(pageSize, 10),};
    const {totalRecord, rows} = await supplierService.getAllSuppliers(params);
    
    sendSuccessResponseWithCount(res, {
      totalRecord,
      data: rows
    });
  } catch (error) {
    console.error("Error in getSuppliersWithMedicines:", error);
    sendErrorResponse(res, error);
  }
};

export const supplierController = {
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
  getAllSuppliers,
};
