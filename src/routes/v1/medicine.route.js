    import express from 'express';
    import { medicineController } from '../../controllers/medicine.controller.js';
    import { medicineValidation } from '../../validations/medicine.validation.js';
    import authenticateJWT from '../../middlewares/authenticateJWT.js';

    const router = express.Router();

    router.route('/')
        // .post(authenticateJWT, medicineValidation.createNew, medicineController.createNew)
        .post( medicineController.createOrUpdateMed)
        .get(medicineController.getAllMed); 

    router.route('/:id')
        // .put(authenticateJWT, medicineValidation.update,  medicineController.update)
        .put( medicineController.update)
        // .delete(authenticateJWT, medicineController.deleteMed)
        .delete(medicineController.deleteMed)
        .get(medicineController.getMed);

        
    export const medicineRouter = router;
