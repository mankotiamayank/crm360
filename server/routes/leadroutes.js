import express from 'express';
import { getLeads, createLead, updateLead, deleteLead } from '../controllers/leadController.js'; 
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getLeads)
  .post(protect, createLead); 

// 🚨 NEW: Routes for Editing and Deleting
router.route('/:id')
  .put(protect, updateLead)
  .delete(protect, deleteLead);

export default router;