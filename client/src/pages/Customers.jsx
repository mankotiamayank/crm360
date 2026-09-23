import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { Building2, Mail, Phone, X, Edit2, Trash2, Search, UserPlus, Users, ArrowUpRight, Sparkles } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../config/api.js';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { addNotification } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_BASE_URL}/api/customers`, config);
      const data = Array.isArray(res.data) ? res.data : res.data.customers || [];
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchCustomers();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (customer) => {
    setEditingId(customer._id);
    setFormData({ name: customer.name, email: customer.email, phone: customer.phone || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(editingId ? 'Updating customer...' : 'Saving customer...');

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/customers/${editingId}`, formData, config);
        toast.success('Customer updated successfully!', { id: toastId });
        addNotification?.({
          title: 'Account Record Updated',
          message: `${formData.name}'s profile details were refreshed.`,
          type: 'customer',
          link: '/customers'
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/customers`, formData, config);
        toast.success('Customer added successfully!', { id: toastId });
        addNotification?.({
          title: 'New Account Onboarded',
          message: `${formData.name} was added to the client directory.`,
          type: 'customer',
          link: '/customers'
        });
      }
      fetchCustomers();
      closeModal();
    } catch (error) {
      const backendError = error.response?.data?.error || error.response?.data?.message || 'Unknown Server Error';
      toast.error(`Error: ${backendError}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const toastId = toast.loading('Deleting customer...');
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${API_BASE_URL}/api/customers/${id}`, config);
        toast.success('Customer deleted!', { id: toastId });
        addNotification?.({
          title: 'Customer Removed',
          message: 'A customer directory record was permanently removed.',
          type: 'customer',
          link: '/customers'
        });
        fetchCustomers();
      } catch (error) {
        const backendError = error.response?.data?.error || error.response?.data?.message || 'Unknown Server Error';
        toast.error(`Failed to delete: ${backendError}`, { id: toastId });
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '' });
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvatarGradient = (name = '') => {
    const gradients = [
      'from-blue-600 to-indigo-600',
      'from-purple-600 to-pink-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-red-600'
    ];
    const charCode = name.charCodeAt(0) || 0;
    return gradients[charCode % gradients.length];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Client Directory</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
              {customers.length} total
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">Manage and organize all key accounts and relationships.</p>
        </div>

        <button 
          onClick={() => { setEditingId(null); setIsModalOpen(true); }} 
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 transition-all duration-200 active:scale-95"
        >
          <UserPlus size={16} />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by client name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
          />
        </div>

        <div className="text-xs text-slate-400 font-medium self-center">
          Showing <span className="font-semibold text-slate-700">{filteredCustomers.length}</span> of {customers.length} clients
        </div>
      </div>

      {/* Customers Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-medium">Loading customer accounts...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
              <Users size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {searchTerm ? 'No clients match your filter' : 'No clients added yet'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 mb-5">
              {searchTerm ? 'Try adjusting your search keywords.' : 'Add your first customer account to begin tracking relationships.'}
            </p>
            {!searchTerm && (
              <button 
                onClick={() => { setEditingId(null); setIsModalOpen(true); }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-500 transition-all"
              >
                <UserPlus size={14} />
                <span>Create First Client</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Customer Name</th>
                  <th className="py-3.5 px-6">Communication Channels</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3.5">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getAvatarGradient(customer.name)} text-white flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-black/5`}>
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{customer.name}</p>
                          <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.2 rounded-full mt-0.5">
                            Verified Account
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 space-y-1">
                      <div className="flex items-center text-xs font-medium text-slate-600">
                        <Mail size={13} className="mr-2 text-slate-400" />
                        <a href={`mailto:${customer.email}`} className="hover:text-blue-600 transition-colors">
                          {customer.email}
                        </a>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center text-xs font-medium text-slate-500">
                          <Phone size={13} className="mr-2 text-slate-400" />
                          <a href={`tel:${customer.phone}`} className="hover:text-blue-600 transition-colors">
                            {customer.phone}
                          </a>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <button 
                          onClick={() => handleEditClick(customer)} 
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Customer"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(customer._id)} 
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Customer"
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

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editingId ? 'Edit Customer Profile' : 'New Customer Account'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Fill in the contact information below</p>
              </div>
              <button 
                onClick={closeModal} 
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="e.g. Sarah Jenkins"
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
                  placeholder="e.g. sarah@enterprise.com"
                  value={formData.email} 
                  onChange={handleInputChange} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Phone Number
                </label>
                <input 
                  type="text" 
                  name="phone" 
                  placeholder="e.g. +1 (555) 234-5678"
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                />
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
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Client' : 'Create Client')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;