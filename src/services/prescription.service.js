import { prescriptionModel } from '../models/prescription.model.js';

const createPrescription = async (userId, cartId) => {
    return await prescriptionModel.createPrescription(userId, cartId);
};

const getPrescriptionById = async (prescriptionId) => {
    return await prescriptionModel.getPrescriptionById(prescriptionId);
};

const getAllPrescriptions = async () => {
    return await prescriptionModel.getAllPrescriptions();
};


const updatePrescriptionStatus = async (prescriptionId, status) => {
    if (!['accepted', 'cancel'].includes(status)) {
        throw new Error('Invalid status');
    }
    return await prescriptionModel.updatePrescriptionStatus(prescriptionId, status);
};

export const prescriptionService = {
    createPrescription,
    getPrescriptionById,
    updatePrescriptionStatus,
    getAllPrescriptions
};
