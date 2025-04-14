import express from 'express';
import { authenticate as auth, authorize } from '../middleware/auth.js';
import {
    checkSubscription,
    addSubscription,
    updateSubscription,
    showPublications,
    makePayment
} from '../controllers/customer.controller.js';

const router = express.Router();

// Subscription management
router.get('/subscriptions', auth, checkSubscription);
router.post('/subscriptions', auth, addSubscription);
router.put('/subscriptions/:id', auth, updateSubscription);

// Publications
router.get('/publications', auth, showPublications);

// Payment handling
router.post('/payments', auth, makePayment);

export default router;