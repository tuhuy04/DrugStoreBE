import { supplierModel } from "../models/supplier.model.js";
import { ValidationError, AppError, ConflictError, NotFoundError } from "../utilities/errors.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";

const addSupplier = async (data) => {
  try {
    const newSupplierId = await supplierModel.addSupplier(data);
    return { id: newSupplierId, message: "Supplier added successfully" };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error in supplier service: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const updateSupplier = async (id, data) => {
  try {
    const existingSupplier = await supplierModel.getSupplierById(id);

    if (!data.name && !data.phone && !data.email && !data.location) {
      throw new ValidationError(
        "At least one field must be provided for update"
      );
    }

    const updatedData = {
      name: data.name || existingSupplier.name,
      phone: data.phone || existingSupplier.phone,
      email: data.email || existingSupplier.email,
      location: data.location || existingSupplier.location,
    };

    return await supplierModel.updateSupplier(id, updatedData);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Error in supplier service: ${error.message}`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteSupplier = async (id) => {
  try {
    const affectedRows = await supplierModel.deleteSupplier(id);
    if (affectedRows === 0) {
      throw new NotFoundError("Supplier not found");
    }
    return { message: "Supplier deleted successfully" };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ConflictError) {
      throw error;
    }
    throw new Error(`Error deleting supplier: ${error.message}`);
  }
};

const getSupplierById = async (id) => {
  try {
    return await supplierModel.getSupplierById(id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new Error(`Error retrieving supplier: ${error.message}`);
  }
};

const getAllSuppliers = async (req) => {
  const { keyword, id } = req.query; 

  try {
    const suppliers = await supplierModel.getAllSuppliers(keyword, id);
    
    return suppliers;
  } catch (error) {
    throw new Error(`Error in getSuppliersWithMedicines service: ${error.message}`);
  }
};

export const supplierService = {
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
  getAllSuppliers,
};
