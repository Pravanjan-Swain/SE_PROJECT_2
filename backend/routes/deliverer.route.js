import express from 'express';
import { authenticate as auth, authorize } from '../middleware/auth.js';
import {
    getDeliveryRoutes,
    createDeliveryRoute,
    updateDeliveryRoute,
    deleteDeliveryRoute,
    getDailyDeliveries,
    markDeliveryComplete,
    markDeliveryFailed,
    getDelivererStats,
    getDelivererPayments
} from '../controllers/deliverer.controller.js';

const router = express.Router();

// Route management
router.get('/routes', auth, getDeliveryRoutes);
router.post('/routes', auth, createDeliveryRoute);
router.put('/routes/:routeId', auth, updateDeliveryRoute);
router.delete('/routes/:routeId', auth, deleteDeliveryRoute);

// Delivery management
router.get('/deliveries/daily', auth, getDailyDeliveries);
router.put('/deliveries/:deliveryId/complete', auth, markDeliveryComplete);
router.put('/deliveries/:deliveryId/failed', auth, markDeliveryFailed);

// Statistics and payments
router.get('/stats', auth, getDelivererStats);
router.get('/payments', auth, getDelivererPayments);

export default router;