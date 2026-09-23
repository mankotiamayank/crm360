import User from '../models/user.js';
import generateToken from '../utils/generateToken.js';

// Login user
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get current user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Update profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.role && req.user.role === 'Admin') {
      user.role = req.body.role;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Get team members (Admin / Manager can view all users)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Fast Role Switcher (Allows seamless switching between Admin, Manager, and Executive sessions)
export const switchRole = async (req, res) => {
  try {
    const { targetRole } = req.body;
    let targetUser;

    if (targetRole === 'Admin') {
      targetUser = await User.findOne({ role: 'Admin' });
    } else if (targetRole === 'Sales Manager') {
      targetUser = await User.findOne({ role: 'Sales Manager' });
    } else {
      targetUser = await User.findOne({ role: 'Sales Executive' });
    }

    if (!targetUser) {
      return res.status(404).json({ message: `No user found for role ${targetRole}` });
    }

    res.json({
      _id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      token: generateToken(targetUser._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error switching role' });
  }
};