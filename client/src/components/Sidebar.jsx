import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckSquare, 
  LogOut, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null },
    { name: 'Customers', path: '/customers', icon: Users, badge: null },
    { name: 'Leads', path: '/leads', icon: Briefcase, badge: 'Hot' },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare, badge: null },
  ];

  return (
    <aside className="w-64 bg-[#090d16] border-r border-slate-800/70 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight flex items-center text-white">
              <span>CRM</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">360</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Enterprise Suite</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Section */}
      <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
            Core Modules
          </p>
          <ul className="space-y-1.5">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/25 to-indigo-600/10 text-white font-semibold shadow-inner border border-blue-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center space-x-3">
                        <item.icon 
                          size={19} 
                          className={`transition-colors duration-200 ${
                            isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                          }`} 
                        />
                        <span>{item.name}</span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400 animate-pulse"></span>
                        )}
                      </div>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-800/60 bg-slate-950/40">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#090d16]"></span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
              <div className="flex items-center space-x-1">
                <ShieldCheck size={11} className="text-blue-400 flex-shrink-0" />
                <p className="text-[11px] text-slate-400 truncate">{user?.role || 'Member'}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors duration-150 flex-shrink-0"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;