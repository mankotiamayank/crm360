import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { Users, Briefcase, CheckSquare, DollarSign, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    customers: 0,
    activeLeads: 0,
    pendingTasks: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const res = await axios.get('http://localhost:5000/api/stats', config);
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchStats();
  }, [user]);

  // Reusable Stat Card Component
  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-4 rounded-full ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">
          {loading ? '...' : value}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'Admin'}!</h1>
        <p className="text-gray-500 text-sm mt-1">Here is what is happening with your business today.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Customers" 
          value={stats.customers} 
          icon={Users} 
          colorClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Active Leads" 
          value={stats.activeLeads} 
          icon={Briefcase} 
          colorClass="bg-yellow-100 text-yellow-600" 
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats.pendingTasks} 
          icon={CheckSquare} 
          colorClass="bg-red-100 text-red-600" 
        />
        <StatCard 
          title="Est. Revenue" 
          value={`$${stats.revenue.toLocaleString()}`} 
          icon={DollarSign} 
          colorClass="bg-green-100 text-green-600" 
        />
      </div>

      {/* Recent Activity Section (Placeholder for future expansion) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
        <div className="flex items-center space-x-2 mb-4">
          <Activity size={20} className="text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900">System Ready</h2>
        </div>
        <p className="text-gray-500 text-sm">
          Your CRM is fully operational. Try adding a new lead with an estimated value, or completing a task, and watch these numbers update automatically!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;