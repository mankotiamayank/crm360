import Customer from '../models/customer.js';

// Get all customers (Role-aware: Admin & Sales Manager see all; Sales Executive sees own/assigned)
export const getCustomers = async (req, res) => {
  try {
    const isElevated = req.user.role === 'Admin' || req.user.role === 'Sales Manager';
    const filter = isElevated 
      ? {} 
      : { $or: [{ user: req.user._id }, { assignedTo: req.user._id }] };

    const customers = await Customer.find(filter).sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
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
      user: req.user._id,
      assignedTo: req.user._id
    });
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(500).json({ error: `POST ERROR: ${error.message}` });
  }
};

// Update a customer
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    
    const isOwner = customer.user?.toString() === req.user._id.toString();
    const isElevated = req.user.role === 'Admin' || req.user.role === 'Sales Manager';
    if (!isOwner && !isElevated) {
      return res.status(403).json({ error: 'Not authorized to modify this customer' });
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

    // Only Admins or the owner can delete
    const isOwner = customer.user?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Only Admins or the record owner can delete customers' });
    }

    await customer.deleteOne();
    res.status(200).json({ message: 'Customer removed' });
  } catch (error) {
    res.status(500).json({ error: `DELETE ERROR: ${error.message}` });
  }
};