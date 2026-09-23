import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { Calendar, CheckSquare, X, Edit2, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../config/api.js';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', dueDate: '', status: 'Pending' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchTasks = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_BASE_URL}/api/tasks`, config);
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchTasks();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (task) => {
    setEditingId(task._id);
    setFormData({
      title: task.title,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '', // Formats date for the input field
      status: task.status || 'Pending'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading(editingId ? 'Updating task...' : 'Saving task...');

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/tasks/${editingId}`, formData, config);
        toast.success('Task updated successfully!', { id: toastId });
      } else {
        await axios.post(`${API_BASE_URL}/api/tasks`, formData, config);
        toast.success('Task added successfully!', { id: toastId });
      }
      fetchTasks();
      closeModal();
    } catch (error) {
      const backendError = error.response?.data?.error || error.response?.data?.message || 'Unknown Server Error';
      toast.error(`Error: ${backendError}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const toastId = toast.loading('Deleting task...');
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, config);
        toast.success('Task deleted!', { id: toastId });
        fetchTasks();
      } catch (error) {
        const backendError = error.response?.data?.error || error.response?.data?.message || 'Unknown Server Error';
        toast.error(`Failed to delete: ${backendError}`, { id: toastId });
      }
    }
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_BASE_URL}/api/tasks/${task._id}`, { status: newStatus }, config);
      toast.success(`Task marked as ${newStatus}`);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ title: '', dueDate: '', status: 'Pending' });
  };

  return (
    <div className="space-y-6 relative">
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks & To-Dos</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your daily follow-ups and action items.</p>
        </div>
        <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm">
          + Add Task
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No tasks pending. You are all caught up!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                  <th className="p-4 font-medium w-12"></th>
                  <th className="p-4 font-medium">Task</th>
                  <th className="p-4 font-medium">Due Date</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks.map((task) => (
                  <tr key={task._id} className={`hover:bg-gray-50 transition group ${task.status === 'Completed' ? 'opacity-50' : ''}`}>
                    <td className="p-4">
                      <button onClick={() => handleStatusToggle(task)} className={`flex items-center justify-center w-6 h-6 rounded border transition ${task.status === 'Completed' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent hover:border-blue-500'}`}>
                        <CheckSquare size={16} />
                      </button>
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      <span className={task.status === 'Completed' ? 'line-through text-gray-500' : ''}>{task.title}</span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date set'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => handleEditClick(task)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(task._id)} className="text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
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
              <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit Task' : 'Add New Task'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Task Title *</label><input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Due Date</label><input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" /></div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2">
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3"><button type="button" onClick={closeModal} className="px-4 py-2 text-sm">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg">{isSubmitting ? 'Saving...' : 'Save Task'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;