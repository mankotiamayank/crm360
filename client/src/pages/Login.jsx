import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        setError(`Cannot reach backend at ${API_BASE_URL}. Ensure the backend is running ("cd server" then "npm run dev").`);
      } else {
        setError(err.response?.data?.message || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role, demoEmail) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="relative min-h-screen bg-[#070a13] text-slate-100 flex items-center justify-center p-4 overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* Radiant Ambient Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl shadow-black/60 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center">
            <span>CRM</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">360</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1.5 font-medium">Customer Relationship & Sales Intelligence</p>
        </div>
        
        {/* Error Notification */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3.5 rounded-xl text-xs font-medium mb-6 text-center leading-relaxed animate-in fade-in duration-150">
            {error}
          </div>
        )}
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail size={16} className="text-slate-500" />
              </div>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-inner"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock size={16} className="text-slate-500" />
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-inner"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-95 flex items-center justify-center space-x-2 text-sm"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to CRM360</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Roles Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Demo Access (Click to autofill)
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Password: password123
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { role: 'Admin', email: 'admin@test.com', label: 'Admin' },
              { role: 'Manager', email: 'manager@test.com', label: 'Manager' },
              { role: 'Executive', email: 'exec@test.com', label: 'Executive' }
            ].map((d) => (
              <button 
                key={d.role}
                type="button"
                onClick={() => setDemoCredentials(d.role, d.email)}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                  selectedRole === d.role
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm shadow-blue-500/20'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;