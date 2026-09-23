import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { 
  Users, 
  Briefcase, 
  CheckSquare, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  Activity, 
  Calendar,
  Sparkles,
  Layers,
  Clock
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
        const res = await axios.get(`${API_BASE_URL}/api/stats`, config);
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchStats();
  }, [user]);

  // Dynamic sample data for visual charts grounded around actual revenue and leads
  const rev = stats.revenue || 125000;
  const revenueChartData = [
    { month: 'Oct', revenue: Math.round(rev * 0.45), target: Math.round(rev * 0.5) },
    { month: 'Nov', revenue: Math.round(rev * 0.6), target: Math.round(rev * 0.65) },
    { month: 'Dec', revenue: Math.round(rev * 0.55), target: Math.round(rev * 0.7) },
    { month: 'Jan', revenue: Math.round(rev * 0.75), target: Math.round(rev * 0.75) },
    { month: 'Feb', revenue: Math.round(rev * 0.9), target: Math.round(rev * 0.85) },
    { month: 'Mar', revenue: Math.round(rev), target: Math.round(rev * 0.95) }
  ];

  const leadDistribution = [
    { stage: 'New', count: Math.max(stats.activeLeads, 1) + 4, fill: '#3b82f6' },
    { stage: 'Contacted', count: Math.max(stats.activeLeads, 1) + 2, fill: '#6366f1' },
    { stage: 'Qualified', count: Math.max(stats.activeLeads, 1), fill: '#8b5cf6' },
    { stage: 'Won', count: Math.max(stats.customers, 1), fill: '#10b981' }
  ];

  const recentEvents = [
    { title: 'New Customer registered', desc: 'Tech Corp joined enterprise tier', time: '12m ago', type: 'customer' },
    { title: 'Deal Qualified', desc: 'Acme Systems pipeline moved to closing', time: '45m ago', type: 'lead' },
    { title: 'Task Completed', desc: 'Follow-up call with product VP logged', time: '2h ago', type: 'task' },
    { title: 'Quarterly target reached', desc: 'Sales exceeded Q1 forecast by 18%', time: '1d ago', type: 'revenue' },
  ];

  const StatCard = ({ title, value, icon: Icon, gradient, trend, trendUp = true }) => (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 ${gradient} opacity-[0.06] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`w-11 h-11 rounded-xl ${gradient} text-white flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform duration-300`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">
          {loading ? (
            <span className="inline-block w-20 h-7 bg-slate-100 rounded animate-pulse"></span>
          ) : (
            value
          )}
        </h3>
        <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60' : 'bg-rose-50 text-rose-600'}`}>
          <ArrowUpRight size={13} className="mr-0.5" />
          {trend}
        </span>
      </div>

      <p className="text-[11px] text-slate-400 mt-2 flex items-center font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
        Active tracking & reporting
      </p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
            <Sparkles size={13} className="text-blue-300" />
            <span>Real-time Workspace Intelligence</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
            Welcome back, {user?.name || 'Administrator'}!
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Here is your executive CRM overview. Live conversion metrics and team pipeline are synchronizing smoothly.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-2.5">
          <button 
            onClick={() => navigate('/customers')}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all shadow-sm active:scale-95"
          >
            <Plus size={15} />
            <span>Add Customer</span>
          </button>
          <button 
            onClick={() => navigate('/leads')}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <Plus size={15} />
            <span>Create Lead</span>
          </button>
        </div>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Total Customers" 
          value={stats.customers} 
          icon={Users} 
          gradient="bg-gradient-to-tr from-blue-600 to-cyan-500" 
          trend="+12.4%"
        />
        <StatCard 
          title="Active Leads" 
          value={stats.activeLeads} 
          icon={Briefcase} 
          gradient="bg-gradient-to-tr from-amber-500 to-orange-500" 
          trend="+8.1%"
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats.pendingTasks} 
          icon={CheckSquare} 
          gradient="bg-gradient-to-tr from-indigo-500 to-purple-600" 
          trend="-3.2%"
          trendUp={false}
        />
        <StatCard 
          title="Est. Revenue" 
          value={`$${stats.revenue.toLocaleString()}`} 
          icon={DollarSign} 
          gradient="bg-gradient-to-tr from-emerald-500 to-teal-500" 
          trend="+24.8%"
        />
      </div>

      {/* Visual Analytics Row (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-800">Revenue & Pipeline Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">Monthly forecasted revenue vs. achieved pipeline</p>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <span className="flex items-center space-x-1.5 text-blue-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Revenue</span>
              </span>
              <span className="flex items-center space-x-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span>Target</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Stage Funnel Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Lead Stage Velocity</h2>
            <p className="text-xs text-slate-400 mt-0.5">Distribution across sales pipeline</p>
          </div>

          <div className="h-56 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadDistribution} layout="vertical" margin={{ top: 0, right: 15, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="stage" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={18} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Healthy Conversion Rate</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">68.4%</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity & Platform Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity size={18} />
              </div>
              <h2 className="text-base font-bold text-slate-800">Recent Operational Feed</h2>
            </div>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">View All</span>
          </div>

          <div className="space-y-4">
            {recentEvents.map((evt, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-slate-50/80 border border-transparent hover:border-slate-100 transition-colors">
                <div className="flex items-center space-x-3.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    evt.type === 'customer' ? 'bg-blue-500' :
                    evt.type === 'lead' ? 'bg-amber-500' :
                    evt.type === 'task' ? 'bg-purple-500' : 'bg-emerald-500'
                  }`}></span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{evt.title}</p>
                    <p className="text-xs text-slate-400">{evt.desc}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 flex items-center">
                  <Clock size={12} className="mr-1" />
                  {evt.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips & System Status */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers size={14} />
              <span>CRM Pro Insights</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Boost Team Conversion</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Customers who have follow-up tasks scheduled within 48 hours close at 3.2x higher rate. Keep tasks updated for real-time manager alerts.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs">
            <span className="text-slate-400">Database Engine</span>
            <span className="inline-flex items-center font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
              Atlas Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;