import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { 
  Calendar, 
  CheckSquare, 
  Square,
  X, 
  Edit2, 
  Trash2, 
  Plus, 
  Check, 
  Clock, 
  AlertCircle,
  Filter,
  Sparkles
} from 'lucide-react';
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
  const [filter, setFilter] = useState('All');

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
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
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

  const pendingCount = tasks.filter(t => t.status !== 'Completed').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Pending') return t.status !== 'Completed';
    if (filter === 'Completed') return t.status === 'Completed';
    return true;
  });

  const isOverdue = (dateString, status) => {
    if (!dateString || status === 'Completed') return false;
    const due = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Tasks & Action Items</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              {pendingCount} pending
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">Stay on top of client follow-ups, calls, and scheduled milestones.</p>
        </div>

        <button 
          onClick={() => { setEditingId(null); setIsModalOpen(true); }} 
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 transition-all duration-200 active:scale-95"
        >
          <Plus size={16} />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Filter Tabs & Summary Row */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          {['All', 'Pending', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === tab
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {tab}
              <span className="ml-1.5 opacity-70">
                {tab === 'All' ? tasks.length : tab === 'Pending' ? pendingCount : completedCount}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
          <span className="flex items-center text-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
            {pendingCount} Open
          </span>
          <span className="flex items-center text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
            {completedCount} Completed
          </span>
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-medium">Loading task queue...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <CheckSquare size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {filter !== 'All' ? `No ${filter.toLowerCase()} tasks found` : 'No action items logged'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 mb-5">
              {filter !== 'All' ? 'Switch tabs to see other items.' : 'Create a reminder or follow-up task to keep deals moving.'}
            </p>
            {filter === 'All' && (
              <button 
                onClick={() => { setEditingId(null); setIsModalOpen(true); }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-500 transition-all"
              >
                <Plus size={14} />
                <span>Create First Task</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6 w-14"></th>
                  <th className="py-3.5 px-6">Task Description</th>
                  <th className="py-3.5 px-6">Due Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => {
                  const completed = task.status === 'Completed';
                  const overdue = isOverdue(task.dueDate, task.status);

                  return (
                    <tr 
                      key={task._id} 
                      className={`hover:bg-slate-50/70 transition-colors group ${completed ? 'bg-slate-50/40' : ''}`}
                    >
                      <td className="py-4 px-6">
                        <button 
                          onClick={() => handleStatusToggle(task)}
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                            completed 
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs' 
                              : 'border-slate-300 hover:border-blue-500 text-transparent'
                          }`}
                        >
                          <Check size={12} strokeWidth={3} />
                        </button>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`text-sm font-semibold transition-all ${
                          completed 
                            ? 'line-through text-slate-400' 
                            : 'text-slate-800'
                        }`}>
                          {task.title}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        {task.dueDate ? (
                          <div className="flex items-center space-x-1.5 text-xs font-medium">
                            <Calendar size={13} className={overdue ? 'text-rose-500' : 'text-slate-400'} />
                            <span className={overdue ? 'text-rose-600 font-bold' : completed ? 'text-slate-400' : 'text-slate-600'}>
                              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            {overdue && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                                Overdue
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No date set</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg border ${
                          completed
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                            : 'bg-amber-50 text-amber-700 border-amber-200/80'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                          {task.status || 'Pending'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <button 
                            onClick={() => handleEditClick(task)} 
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Task"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(task._id)} 
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editingId ? 'Edit Action Item' : 'New Task / Milestone'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Specify task details and target completion date</p>
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
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  placeholder="e.g. Schedule onboarding demo with CFO"
                  value={formData.title} 
                  onChange={handleInputChange} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Target Date
                  </label>
                  <input 
                    type="date" 
                    name="dueDate" 
                    value={formData.dueDate} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Status
                  </label>
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleInputChange} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
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
                  {isSubmitting ? 'Saving...' : (editingId ? 'Update Task' : 'Save Task')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;