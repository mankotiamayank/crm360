import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // This attempts to connect to the MONGO_URI we put in the .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 TIP: Check if your current IP is whitelisted in MongoDB Atlas (Network Access -> Add IP Address -> 0.0.0.0/0).');
    process.exit(1); // Stop the app if it can't connect
  }
};

export default connectDB;