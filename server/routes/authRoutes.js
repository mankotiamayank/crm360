import express from 'express';
import { 
  authUser, 
  getUserProfile, 
  updateUserProfile, 
  getAllUsers, 
  switchRole 
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/switch-role', switchRole);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.get('/users', protect, getAllUsers);

export default router;