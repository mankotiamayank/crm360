import express from 'express';
import { getDashboardStats } from '../controllers/statController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protected route for fetching dashboard overview
router.route('/').get(protect, getDashboardStats);

export default router;