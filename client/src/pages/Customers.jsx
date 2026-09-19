import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { Building2, Mail, Phone, X, Edit2, Trash2, Search } from 'lucide-react';
// 🚨 NEW: Imported the Toast library
import toast, { Toaster } from 'react-hot-toast';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('http://localhost:5000/api/customers', config);
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
    
    // 🚨 We start a loading toast that we can update later!
    const toastId = toast.loading(editingId ? 'Updating customer...' : 'Saving customer...');

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (editingId) {
        await axios.put(`http://localhost:5000/api/customers/${editingId}`, formData, config);
        toast.success('Customer updated successfully!', { id: toastId }); // 🚨 Success Toast
      } else {
        await axios.post('http://localhost:5000/api/customers', formData, config);
        toast.success('Customer added successfully!', { id: toastId }); // 🚨 Success Toast
      }
      fetchCustomers();
      closeModal();
    } catch (error) {
      const backendError = error.response?.data?.error || error.response?.data?.message || 'Unknown Server Error';
      toast.error(`Error: ${backendError}`, { id: toastId }); // 🚨 Error Toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      const toastId = toast.loading('Deleting customer...');
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/customers/${id}`, config);
        toast.success('Customer deleted!', { id: toastId }); // 🚨 Success Toast
        fetchCustomers();
      } catch (error) {
        const backendError = error.response?.data?.error || error.response?.data?.message || 'Unknown Server Error';
        toast.error(`Failed to delete: ${backendError}`, { id: toastId }); // 🚨 Error Toast
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', email: '', phone: '' });
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      {/* 🚨 NEW: This invisible component allows the toasts to render on screen */}
      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Directory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your active client relationships.</p>
        </div>
        <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm">
          + Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading customers...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No customers match your search.' : 'No customers found. Add your first client!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                  <th className="p-4 font-medium">Customer Name</th>
                  <th className="p-4 font-medium">Contact Info</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50 transition group">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center text-sm text-gray-500"><Mail size={14} className="mr-2" /> {customer.email}</div>
                      {customer.phone && <div className="flex items-center text-sm text-gray-500"><Phone size={14} className="mr-2" /> {customer.phone}</div>}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => handleEditClick(customer)} className="text-blue-600 hover:text-blue-800 transition" title="Edit Customer"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(customer._id)} className="text-red-400 hover:text-red-600 transition" title="Delete Customer"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Customer' : 'Save Customer')}
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