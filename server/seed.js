import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/user.js';
import Customer from './models/customer.js';

// Load our secret variables and connect to the database
dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Clear out any old data to start fresh
    await User.deleteMany();
    await Customer.deleteMany();

    // 2. Create three sample users (Admin, Manager, Executive)
    // Note: We use .create() so our password hashing security works!
    const users = await User.create([
      { name: 'Admin Alice', email: 'admin@test.com', password: 'password123', role: 'Admin' },
      { name: 'Manager Bob', email: 'manager@test.com', password: 'password123', role: 'Sales Manager' },
      { name: 'Executive Charlie', email: 'exec@test.com', password: 'password123', role: 'Sales Executive' }
    ]);

    // 3. Create a fake customer and assign them to the Sales Executive (Charlie)
    await Customer.create({
      name: 'John Doe',
      company: 'Tech Corp',
      email: 'john@techcorp.com',
      phone: '555-1234',
      assignedTo: users[2]._id // This links the customer to Charlie
    });

    console.log('Dummy Data Successfully Seeded! 🌱');
    process.exit(); // Close the script
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the function
importData();