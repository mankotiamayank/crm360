import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';
import toast from 'react-hot-toast';
import { 
  X, 
  User, 
  ShieldCheck, 
  Mail, 
  Briefcase, 
  Crown, 
  Check, 
  Save, 
  Building2, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Sliders
} from 'lucide-react';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, login } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  if (!isOpen) return null;

  // Handle saving profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading('Updating profile...');

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.put(`${API_BASE_URL}/api/auth/profile`, { name, email }, config);
      login(res.data);
      toast.success('Profile updated successfully!', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // Switch between Admin, Manager, and Executive roles
  const handleSwitchRole = async (targetRole) => {
    if (user?.role === targetRole) return;
    setIsSwitching(true);
    const toastId = toast.loading(`Switching role to ${targetRole}...`);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/switch-role`, { targetRole });
      login(res.data);
      setName(res.data.name);
      setEmail(res.data.email);
      toast.success(`Active profile switched to ${res.data.name} (${res.data.role})!`, { id: toastId });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      toast.error('Failed to switch role', { id: toastId });
    } finally {
      setIsSwitching(false);
    }
  };

  const roles = [
    {
      role: 'Admin',
      name: 'Admin Alice',
      desc: 'Complete organization control, team management & company-wide revenue oversight.',
      icon: Crown,
      color: 'from-amber-500 to-orange-500',
      badge: 'Full Access'
    },
    {
      role: 'Sales Manager',
      name: 'Manager Bob',
      desc: 'Pipeline velocity tracking, quota allocation & team performance monitoring.',
      icon: Briefcase,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Management'
    },
    {
      role: 'Sales Executive',
      name: 'Executive Charlie',
      desc: 'Assigned accounts, active deal progression & direct task execution.',
      icon: User,
      color: 'from-purple-600 to-pink-600',
      badge: 'Execution'
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sliders size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 tracking-tight">Profile & Role Command Center</h2>
              <p className="text-xs text-slate-400">Manage your active identity, role permissions, and profile credentials</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 lg:p-8 space-y-8">
          {/* Active Identity Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 text-white flex items-center justify-center text-xl font-black shadow-md ring-2 ring-white/20">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white">{user?.name || 'Administrator'}</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-xs text-slate-300">{user?.email}</p>
                <div className="inline-flex items-center space-x-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-blue-300">
                  <ShieldCheck size={13} />
                  <span>Role: {user?.role || 'Admin'}</span>
                </div>
              </div>
            </div>

            <div className="sm:text-right text-xs text-slate-400 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-700">
              <p className="font-semibold text-slate-300">CRM360 Enterprise</p>
              <p>Workspace: Production</p>
            </div>
          </div>

          {/* Role Switching & Permissions Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Operational Role Switcher</h4>
                <p className="text-xs text-slate-400">Switch roles to experience separate permissions, metrics & scopes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {roles.map((r) => {
                const isActive = user?.role === r.role;
                const Icon = r.icon;

                return (
                  <div
                    key={r.role}
                    className={`rounded-2xl p-4 border transition-all relative flex flex-col justify-between ${
                      isActive
                        ? 'bg-blue-50/60 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${r.color} text-white flex items-center justify-center shadow-sm`}>
                          <Icon size={18} />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isActive 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {isActive ? 'Current' : r.badge}
                        </span>
                      </div>

                      <h5 className="font-bold text-sm text-slate-800">{r.role}</h5>
                      <p className="text-[11px] font-semibold text-blue-600 mb-1">{r.name}</p>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">{r.desc}</p>
                    </div>

                    <button
                      type="button"
                      disabled={isActive || isSwitching}
                      onClick={() => handleSwitchRole(r.role)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white cursor-default'
                          : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 active:scale-95'
                      }`}
                    >
                      {isActive ? 'Active Identity' : 'Switch to Profile'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role Capabilities Matrix */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Active Role Capabilities ({user?.role || 'Admin'})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Check size={11} strokeWidth={3} />
                </span>
                <span>
                  {user?.role === 'Admin' ? 'View & Manage Company-Wide Records' : 
                   user?.role === 'Sales Manager' ? 'View Team Pipeline & Deal Sizes' : 
                   'View & Manage Assigned Accounts'}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Check size={11} strokeWidth={3} />
                </span>
                <span>Create Customers, Leads & Tasks</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <span className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  user?.role === 'Admin' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'
                }`}>
                  {user?.role === 'Admin' ? <Check size={11} strokeWidth={3} /> : <X size={11} />}
                </span>
                <span className={user?.role === 'Admin' ? 'text-slate-700' : 'text-slate-400'}>
                  Global Record Deletion (Admin Only)
                </span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Check size={11} strokeWidth={3} />
                </span>
                <span>Interactive Global Search & Notifications</span>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">Edit Profile Information</h4>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
