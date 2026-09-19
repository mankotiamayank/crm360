import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // Ensures empty strings from the frontend don't crash the Date formatter
  dueDate: { type: Date }, 
  status: { type: String, default: 'Pending' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// 🚨 This line prevents the "OverwriteModelError" crash
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default Task;