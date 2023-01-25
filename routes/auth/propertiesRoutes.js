import express from 'express';
import { myProperties } from '../../controllers/auth/propertyController.js';
const router = express.Router();

// Propiedades
// router.get('/properties', properties)

// Mis propiedades
router.get('/my-properties', myProperties)

export default router;