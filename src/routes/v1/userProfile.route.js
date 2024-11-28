// userProfile.route.js
import express from 'express';
// Đảm bảo đường dẫn chính xác
import { userProfileController } from '../../controllers/userProfile.controller.js';
import authenticateJWT from '../../middlewares/authenticateJWT.js';
import { usersValidation } from '../../validations/users.validation.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder to save uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // Get the original file extension
        cb(null, uniqueSuffix + ext); // Append extension to filename
    }
});

const upload = multer({ storage });

const { validateUpdateProfile } = usersValidation;

const router = express.Router();

router.get('/profile', authenticateJWT, userProfileController.getProfile);


router.put('/profile', authenticateJWT, upload.single('profile_image'), validateUpdateProfile, userProfileController.updateProfile);

export const userProfileRouter = router;
