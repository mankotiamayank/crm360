import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  estimatedValue: { type: Number, default: 0 },
  status: { type: String, default: 'New' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// 🚨 This line checks if the model already exists in memory before compiling it!
const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

export default Lead;