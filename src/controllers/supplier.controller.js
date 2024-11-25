import { supplierService } from "../services/supplier.service.js";
import { HTTP_STATUS_CODE } from "../utilities/constants.js";

const addSupplier = async (req, res) => {
    const { name, phone, email, location } = req.body;
    try {
        const result = await supplierService.addSupplier(req.body);
        res.status(HTTP_STATUS_CODE.CREATED).send(result);
    } catch (error) {
        console.log(req.body); 
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({
            error: error.message,
        });
    }
}

const updateSupplier = async (req, res) => {
    const id = req.params.id;
    const { name, phone, email, location } = req.body;
    try {
        const result = await supplierService.updateSupplier(id, req.body);
        res.status(HTTP_STATUS_CODE.OK).send(result);
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
            error: new Error(error).message,
        });
    }
}

const deleteSupplier = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await supplierService.deleteSupplier(id);
        res.status(HTTP_STATUS_CODE.OK).send(result);
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
            error: error.message,
        });
    }
}

const getSupplierById = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await supplierService.getSupplierById(id);
        res.status(HTTP_STATUS_CODE.OK).send(result);
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
            error: error.message,
        });
    }
}

const getAllSuppliers = async (req, res) => {
    try {
        const result = await supplierService.getAllSuppliers();
        res.status(HTTP_STATUS_CODE.OK).send(result);
    } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({
            error: error.message,
        });
    }
}

export const supplierController = {
    addSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierById,
    getAllSuppliers
}