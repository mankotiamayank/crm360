import Lead from '../models/lead.js';

// Get all leads (Role-aware: Admin & Sales Manager see company pipeline; Sales Executive sees own deals)
export const getLeads = async (req, res) => {
  try {
    const isElevated = req.user.role === 'Admin' || req.user.role === 'Sales Manager';
    const filter = isElevated ? {} : { user: req.user._id };

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (error) {
    console.error("Error in getLeads:", error);
    res.status(500).json({ message: 'Server Error fetching leads' });
  }
};

// Create a new lead
export const createLead = async (req, res) => {
  try {
    const { name, email, company, estimatedValue, status } = req.body;

    const newLead = new Lead({
      name,
      email,
      company,
      estimatedValue: estimatedValue || 0,
      status: status || 'New',
      user: req.user._id 
    });

    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    console.error("CRITICAL ERROR in createLead:", error.message);
    res.status(500).json({ message: 'Failed to create lead', error: error.message });
  }
};

// Update a lead
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const isOwner = lead.user?.toString() === req.user._id.toString();
    const isElevated = req.user.role === 'Admin' || req.user.role === 'Sales Manager';
    if (!isOwner && !isElevated) {
      return res.status(403).json({ message: 'Not authorized to update this lead' });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedLead);
  } catch (error) {
    console.error("Error updating lead:", error.message);
    res.status(500).json({ message: 'Failed to update lead' });
  }
};

// Delete a lead
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const isOwner = lead.user?.toString() === req.user._id.toString();
    const isElevated = req.user.role === 'Admin' || req.user.role === 'Sales Manager';
    if (!isOwner && !isElevated) {
      return res.status(403).json({ message: 'Not authorized to delete this lead' });
    }

    await lead.deleteOne();
    res.status(200).json({ message: 'Lead removed successfully' });
  } catch (error) {
    console.error("Error deleting lead:", error.message);
    res.status(500).json({ message: 'Failed to delete lead' });
  }
};