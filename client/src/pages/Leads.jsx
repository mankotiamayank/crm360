import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { 
  Briefcase, 
  Mail, 
  DollarSign, 
  X, 
  Edit2, 
  Trash2, 
  Search, 
  Plus, 
  Sparkles, 
  Building, 
  Tag, 
  Filter 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../config/api.js';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { addNotification } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', estimatedValue: '', status: 'New' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchLeads = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_BASE_URL}/api/leads`, config);
      setLeads(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchLeads();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (lead) => {
    setEditingId(lead._id);
    setFormData({
      name: lead.name,
      email: lead.email,
      company: lead.company || '',
      estimatedValue: lead.estimatedValue || '',
      status: lead.status || 'New'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(editingId ? 'Updating lead...' : 'Saving lead...');

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/leads/${editingId}`, formData, config);
        toast.success('Lead updated successfully!', { id: toastId });
        addNotification?.({
          title: 'Pipeline Stage Updated',
          message: `${formData.name}'s deal status shifted to "${formData.status}".`,
          type: 'lead',
          link: '/leads'
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/leads`, formData, config);
        toast.success('Lead added successfully!', { id: toastId });
        addNotification?.({
          title: 'Deal Opportunity Logged',
          message: `${formData.name} (${formData.company || 'Enterprise'}) valued at $${formData.estimatedValue || '0'} added.`,
          type: 'lead',
          link: '/leads'
        });
      }
      fetchLeads();
      closeModal();
    } catch (error) {
      const backendError = error.response?.data?.error || error.response?.data?.message || 'Unknown Server Error';
      toast.error(`Error: ${backendError}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      const toastId = toast.loading('Deleting lead...');
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${API_BASE_URL}/api/leads/${id}`, config);
        toast.success('Lead deleted!', { id: toastId });
        addNotification?.({
          title: 'Lead Opportunity Dismissed',
          message: 'A pipeline lead was removed from tracking.',
          type: 'lead',
          link: '/leads'
        });
        fetchLeads();
      } catch (error) {
        const backendError = error.response?.data?.error || error.response?.data?.message || 'Unknown Server Error';
        toast.error(`Failed to delete: ${backendError}`, { id: toastId });
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', email: '', company: '', estimatedValue: '', status: 'New' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Won':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-500/10';
      case 'Qualified':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80 ring-indigo-500/10';
      case 'Contacted':
        return 'bg-purple-50 text-purple-700 border-purple-200/80 ring-purple-500/10';
      case 'Lost':
        return 'bg-rose-50 text-rose-700 border-rose-200/80 ring-rose-500/10';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200/80 ring-blue-500/10';
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Won', 'Lost'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Sales Pipeline</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
              {leads.length} active leads
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">Track prospective opportunities, deal sizes, and conversion stages.</p>
        </div>

        <button 
          onClick={() => { setEditingId(null); setIsModalOpen(true); }} 
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 transition-all duration-200 active:scale-95"
        >
          <Plus size={16} />
          <span>Create New Lead</span>
        </button>
      </div>

      {/* Pipeline Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {st}
              {st !== 'All' && (
                <span className="ml-1.5 opacity-60">
                  {leads.filter(l => l.status === st).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-medium">Loading sales leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Briefcase size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {searchTerm || selectedStatus !== 'All' ? 'No leads matching current filters' : 'Pipeline is empty'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 mb-5">
              {searchTerm || selectedStatus !== 'All' ? 'Try changing your search term or status filter.' : 'Capture your first prospect to start monitoring projected revenue.'}
            </p>
            {selectedStatus === 'All' && !searchTerm && (
              <button 
                onClick={() => { setEditingId(null); setIsModalOpen(true); }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-500 transition-all"
              >
                <Plus size={14} />
                <span>Create First Lead</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Opportunity / Lead</th>
                  <th className="py-3.5 px-6">Est. Deal Value</th>
                  <th className="py-3.5 px-6">Pipeline Stage</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-black/5">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{lead.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                            <span className="flex items-center font-medium">
                              <Building size={12} className="mr-1 text-slate-400" />
                              {lead.company || 'Direct Prospect'}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-400">{lead.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-sm font-extrabold text-slate-800 font-mono">
                        ${(lead.estimatedValue || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg border ring-1 ${getStatusBadge(lead.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                        {lead.status || 'New'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <button 
                          onClick={() => handleEditClick(lead)} 
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Opportunity"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(lead._id)} 
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Opportunity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editingId ? 'Edit Sales Opportunity' : 'New Sales Lead'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Enter details for this prospective deal</p>
              </div>
              <button 
                onClick={closeModal} 
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Lead Name <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="e.g. Johnathan Vance"
                  value={formData.name} 
                  onChange={handleInputChange} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="e.g. jvance@acme.com"
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Company / Organization
                </label>
                <input 
                  type="text" 
                  name="company" 
                  placeholder="e.g. Acme Corporation"
                  value={formData.company} 
                  onChange={handleInputChange} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Est. Value ($)
                  </label>
                  <input 
                    type="number" 
                    name="estimatedValue" 
                    placeholder="25000"
                    value={formData.estimatedValue} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Stage
                  </label>
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Lead' : 'Save Lead')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;