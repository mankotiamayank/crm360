import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// 🚨 This line prevents the hidden Mongoose crash!
const Customer = mongoose.models.Customer || mongoose.model('Customer', customerSchema);

export default Customer;