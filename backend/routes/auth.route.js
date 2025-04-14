import express from 'express';
import { authenticate as auth } from '../middleware/auth.js';
import { register, login } from '../controllers/auth.controller.js';

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);

export default router;