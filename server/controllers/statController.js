import Customer from '../models/customer.js';
import Lead from '../models/lead.js';
import Task from '../models/task.js';

export const getDashboardStats = async (req, res) => {
  try {
    const isElevated = req.user.role === 'Admin' || req.user.role === 'Sales Manager';
    const query = isElevated ? {} : { user: req.user._id };

    // 1. Total customers in scope
    const customerCount = await Customer.countDocuments(query);

    // 2. Active Leads & Total Estimated Revenue in scope
    const leads = await Lead.find(query);
    const activeLeadsCount = leads.filter(lead => lead.status !== 'Lost').length;
    const totalRevenue = leads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);

    // 3. Pending Tasks in scope
    const pendingTasksCount = await Task.countDocuments({ 
      ...query, 
      status: { $ne: 'Completed' } 
    });

    res.status(200).json({
      customers: customerCount,
      activeLeads: activeLeadsCount,
      pendingTasks: pendingTasksCount,
      revenue: totalRevenue,
      scope: isElevated ? 'organization' : 'personal',
      role: req.user.role
    });
  } catch (error) {
    console.error("CRITICAL ERROR in getDashboardStats:", error.message);
    res.status(500).json({ message: 'Server Error fetching stats' });
  }
};