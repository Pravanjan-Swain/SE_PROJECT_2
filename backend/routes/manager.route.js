import express from 'express';
import { authenticate as auth, authorize } from '../middleware/auth.js';
import {
    addPublication,
    updatePublication,
    getAllPublications,
    getPublication,
    getAllCustomers,
    getCustomer
} from '../controllers/manager.controller.js';

const router = express.Router();

// Publication management
router.get('/publications', auth, getAllPublications);
router.get('/publications/:id', auth, getPublication);
router.post('/publications', auth, addPublication);
router.put('/publications/:id', auth, updatePublication);

// Customer management
router.get('/customers', auth, getAllCustomers);
router.get('/customers/:id', auth, getCustomer);

export default router;