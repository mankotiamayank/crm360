import express from 'express';
import { getTasks, createTask, deleteTask, updateTask } from '../controllers/taskController.js'; // 🚨 Added updateTask
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .delete(protect, deleteTask)
  .put(protect, updateTask); // 🚨 New PUT route for editing

export default router;