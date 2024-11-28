import { prescriptionService } from '../services/prescription.service.js';
import { HTTP_STATUS_CODE } from '../utilities/constants.js';

const createPrescription = async (req, res) => {
    try {
        const { cartId } = req.body;
        const prescriptionId = await prescriptionService.createPrescription(req.user.userId, cartId);
        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            data: { prescriptionId }
        });
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            error: error.message
        });
    }
};

const updatePrescriptionStatus = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const { status } = req.body;
        await prescriptionService.updatePrescriptionStatus(prescriptionId, status);
        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            message: `Prescription status updated to ${status}`
        });
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            error: error.message
        });
    }
};

const getAllPrescriptions = async (req, res) => {
    try {
        const prescriptions = await prescriptionService.getAllPrescriptions();
        res.status(HTTP_STATUS_CODE.OK).json({
            code: HTTP_STATUS_CODE.OK,
            status: 'success',
            data: prescriptions
        });
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            code: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
            status: 'fail',
            error: error.message
        });
    }
};

export const prescriptionController = {
    createPrescription,
    updatePrescriptionStatus,
    getAllPrescriptions
};
