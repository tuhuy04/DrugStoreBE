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

const sortByDate = async () => {
  try {
    return await medicineModel.sortByDate();
  } catch (error) {
    throw new Error(`Error sorting medicines by date: ${error.message}`);
  }
};

const sortByCategory = async () => {
  try {
    return await medicineModel.sortByCategory();
  } catch (error) {
    throw new Error(`Error sorting medicines by category: ${error.message}`);
  }
};

const checkStock = async () => {
  try {
    const lowStockItems = await medicineModel.checkStock();
    if (lowStockItems.length === 0) {
      return { message: "All medicines are well-stocked." };
    }
    return {
      message: "Some medicines are low in stock.",
      items: lowStockItems,
    };
  } catch (error) {
    throw new Error(`Error checking medicine stock: ${error.message}`);
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
  sortByDate,
  sortByCategory,
  checkStock,
};


// const medicineModel = require('../models/medicine.model');  // Giả sử bạn có model medicine ở đây

// // Tạo hoặc cập nhật thuốc
// const createOrUpdateMed = async (medicineData) => {
//   try {
//     // Gọi phương thức tạo hoặc cập nhật từ model
//     const result = await medicineModel.createOrUpdateMed(medicineData);
//     return result; // Trả về kết quả (có thể là thông tin thuốc mới tạo hoặc cập nhật)
//   } catch (error) {
//     console.error('Error in createOrUpdateMed:', error.message);
//     throw new Error(error.message || 'An error occurred while creating or updating the medicine');
//   }
// };

// // Cập nhật thông tin thuốc
// const updateMed = async (id, medicineData) => {
//   try {
//     const result = await medicineModel.updateMed(id, medicineData);
//     return result; // Trả về kết quả cập nhật
//   } catch (error) {
//     console.error('Error in updateMed:', error.message);
//     throw new Error(error.message || 'An error occurred while updating the medicine');
//   }
// };

// // Xóa thuốc
// const deleteMed = async (id) => {
//   try {
//     const result = await medicineModel.deleteMed(id);
//     return result; // Trả về kết quả xóa
//   } catch (error) {
//     console.error('Error in deleteMed:', error.message);
//     throw new Error(error.message || 'An error occurred while deleting the medicine');
//   }
// };

// // Lấy danh sách thuốc
// const getAllMeds = async () => {
//   try {
//     const result = await medicineModel.getAllMeds();
//     return result; // Trả về danh sách thuốc
//   } catch (error) {
//     console.error('Error in getAllMeds:', error.message);
//     throw new Error(error.message || 'An error occurred while fetching medicines');
//   }
// };

// // Lấy thông tin thuốc theo ID
// const getMedById = async (id) => {
//   try {
//     const result = await medicineModel.getMedById(id);
//     return result; // Trả về thuốc theo ID
//   } catch (error) {
//     console.error('Error in getMedById:', error.message);
//     throw new Error(error.message || 'An error occurred while fetching the medicine by ID');
//   }
// };

// module.exports = {
//   createOrUpdateMed,
//   updateMed,
//   deleteMed,
//   getAllMeds,
//   getMedById
// };
