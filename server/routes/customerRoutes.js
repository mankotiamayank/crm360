import express from 'express';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Handles fetching all customers and adding new ones
router.route('/')
  .get(protect, getCustomers)
  .post(protect, createCustomer);

// Handles editing and deleting specific customers by their ID
router.route('/:id')
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);

export default router;