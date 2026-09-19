import Customer from '../models/customer.js';

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    // 🚨 Forces the exact error message back to the frontend
    res.status(500).json({ error: `GET ERROR: ${error.message}` });
  }
};

// Create a new customer
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newCustomer = new Customer({
      name,
      email,
      phone,
      user: req.user._id 
    });
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    // 🚨 Forces the exact error message back to the frontend
    res.status(500).json({ error: `POST ERROR: ${error.message}` });
  }
};

// Update a customer
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    
    if (customer.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: `PUT ERROR: ${error.message}` });
  }
};

// Delete a customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    if (customer.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized' });
    }

    await customer.deleteOne();
    res.status(200).json({ message: 'Customer removed' });
  } catch (error) {
    res.status(500).json({ error: `DELETE ERROR: ${error.message}` });
  }
};