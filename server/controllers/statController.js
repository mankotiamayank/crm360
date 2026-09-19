import Customer from '../models/customer.js';
import Lead from '../models/lead.js';
import Task from '../models/task.js'; // Ensure your model files are lowercase in the folder!

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Count total customers
    const customerCount = await Customer.countDocuments({ user: userId });

    // 2. Calculate Active Leads & Total Estimated Revenue
    const leads = await Lead.find({ user: userId });
    const activeLeadsCount = leads.filter(lead => lead.status !== 'Lost').length;
    const totalRevenue = leads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);

    // 3. Count Pending Tasks
    const pendingTasksCount = await Task.countDocuments({ 
      user: userId, 
      status: { $ne: 'Completed' } 
    });

    // Send the aggregated data back to the frontend
    res.status(200).json({
      customers: customerCount,
      activeLeads: activeLeadsCount,
      pendingTasks: pendingTasksCount,
      revenue: totalRevenue
    });
  } catch (error) {
    console.error("CRITICAL ERROR in getDashboardStats:", error.message);
    res.status(500).json({ message: 'Server Error fetching stats' });
  }
};