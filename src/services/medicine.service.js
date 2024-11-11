import { medicineModel } from "../models/medicine.model.js";

const createOrUpdate = async (medications) => {
  try {
    return await medicineModel.createOrUpdateMed(medications);
  } catch (error) {
    throw new Error(`Error creating or updating medicines: ${error.message}`);
  }
};

const update = async (id, data) => {
  try {
    const existingMedicine = await medicineModel.getMedById(id);
    if (!existingMedicine) {
      throw new Error("Medicine not found");
    }

    const updatedData = {
      name: data.name || existingMedicine.name,
      category_id: data.category_id || existingMedicine.category_id,
      supplier_id: data.supplier_id || existingMedicine.supplier_id,
      description: data.description || existingMedicine.description,
      unit: data.unit || existingMedicine.unit,
      cost_price: data.cost_price || existingMedicine.cost_price,
      selling_price: data.selling_price || existingMedicine.selling_price,
      image_url: data.image_url || existingMedicine.image_url,
    };

    const affectedRows = await medicineModel.updateMed(id, updatedData);
    if (affectedRows === 0) {
      throw new Error("No changes were made or medicine not found");
    }

    return { message: "Medicine updated successfully" };
  } catch (error) {
    throw new Error(`Error updating medicine: ${error.message}`);
  }
};


const deleteById = async (id) => {
  try {
    const affectedRows = await medicineModel.deleteMed(id);
    if (affectedRows === 0) {
      throw new Error("Medicine not found");
    }
    return { message: "Medicine deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting medicine: ${error.message}`);
  }
};

const getById = async (id) => {
  try {
    const medicine = await medicineModel.getMedById(id);
    if (!medicine) {
      throw new Error("Medicine not found");
    }
    return medicine;
  } catch (error) {
    throw new Error(`Error retrieving medicine: ${error.message}`);
  }
};

const getAll = async () => {
  try {
    return await medicineModel.getAllMed();
  } catch (error) {
    throw new Error(`Error retrieving medicines: ${error.message}`);
  }
};

const find = async (searchParams) => {
  try {
    const medicine = await medicineModel.findMed(searchParams);
    if (!medicine) {
      throw new Error("Medicine not found");
    }
    return medicine;
  } catch (error) {
    throw new Error(`Error finding medicine: ${error.message}`);
  }
};

const importMedicine = async (id, quantity) => {
  try {
    const affectedRows = await medicineModel.importMed(id, quantity);
    if (affectedRows === 0) {
      throw new Error("Medicine not found");
    }
    return { message: "Medicine imported successfully" };
  } catch (error) {
    throw new Error(`Error importing medicine: ${error.message}`);
  }
};

const sell = async (id, quantity) => {
  try {
    const affectedRows = await medicineModel.sellMed(id, quantity);
    if (affectedRows === 0) {
      throw new Error("Not enough stock to sell");
    }
    return { message: "Medicine sold successfully" };
  } catch (error) {
    throw new Error(`Error selling medicine: ${error.message}`);
  }
};

export const medicineService = {
  // createNew,
  update,
  deleteById,
  getById,
  getAll,
  find,
  importMedicine,
  sell,
  createOrUpdate,
};
