import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import User from './models/user.js';
import Customer from './models/customer.js';

// 1. Load variables and connect to the REAL database
dotenv.config();
connectDB();

// The autoSeed function is kept here for reference but disabled below
const autoSeed = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Database is empty. Auto-seeding initial data...');
      const users = await User.create([
        { name: 'Admin Alice', email: 'admin@test.com', password: 'password123', role: 'Admin' },
        { name: 'Manager Bob', email: 'manager@test.com', password: 'password123', role: 'Sales Manager' },
        { name: 'Executive Charlie', email: 'exec@test.com', password: 'password123', role: 'Sales Executive' }
      ]);

      await Customer.create({
        name: 'John Doe',
        company: 'Tech Corp',
        email: 'john@techcorp.com',
        phone: '555-1234',
        user: users[2]._id,
        assignedTo: users[2]._id
      });
      console.log('✅ Auto-seed completed successfully!');
    }
  } catch (err) {
    console.error('Auto-seed error:', err.message);
  }
};

// ---> AUTO-SEED DISABLED FOR PRODUCTION <---
// autoSeed(); 

// 2. Initialize Express
const app = express();
app.use(cors()); 
app.use(express.json()); 

// 3. Import Routes 
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import statRoutes from './routes/statRoutes.js';

// 4. Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stats', statRoutes);

// 5. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});