import { supplierModel } from "../models/supplier.model.js";

const addSupplier = async (data) => {
  try {
    const newSupplierId = await supplierModel.addSupplier(data);
    return { id: newSupplierId, message: "Supplier added successfully" };
  } catch (error) {
    if (error.message === "Supplier already exists") {
      throw new Error(
        "Supplier already exists. Please choose a different name."
      );
    }
    throw new Error(`Error adding supplier: ${error.message}`);
  }
};

const updateSupplier = async (id, data) => {
  try {
    const existingSupplier = await supplierModel.getSupplierById(id);
    if (!existingSupplier) {
      throw new Error("Supplier not found");
    }

    const updatedData = {
      name: data.name || existingSupplier.name,
      phone: data.phone || existingSupplier.phone,
      email: data.email || existingSupplier.email,
      location: data.location || existingSupplier.location,
    };

    const affectedRows = await supplierModel.updateSupplier(id, updatedData);
    if (affectedRows === 0) {
      throw new Error("No changes were made or supplier not found"); 
    }
    return { message: "Supplier updated successfully" };
  } catch (error) {
    throw new Error(`Error updating supplier: ${error.message}`);
  }
};

const deleteSupplier = async (id) => {
  try {
    return await supplierModel.deleteSupplier(id);
  } catch (error) {
    throw new Error(`Error deleting supplier: ${error.message}`);
  }
};

const getSupplierById = async (id) => {
  try {
    return await supplierModel.getSupplierById(id);
  } catch (error) {
    throw new Error(`Error retrieving supplier: ${error.message}`);
  }
};

const getAllSuppliers = async () => {
  try {
    return await supplierModel.getAllSuppliers();
  } catch (error) {
    throw new Error(`Error retrieving suppliers: ${error.message}`);
  }
};

export const supplierService = {
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
  getAllSuppliers,
};
