import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Bell, Sparkles, CheckCircle2 } from 'lucide-react';
import GlobalSearch from './GlobalSearch.jsx';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/85 border-b border-slate-200/80 h-16 flex items-center justify-between px-6 lg:px-8 transition-colors">
      
      {/* Global Search Component */}
      <div className="w-full max-w-md">
        <GlobalSearch />
      </div>

      {/* Right Controls: System Status, Notifications & User Avatar */}
      <div className="flex items-center space-x-4 lg:space-x-6">
        {/* Live Status Indicator */}
        <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Live Sync</span>
        </div>

        {/* Notifications Button */}
        <button 
          aria-label="Notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50/60 transition-all duration-200"
        >
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
        </button>
        
        {/* User Card */}
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Administrator'}</p>
            <p className="text-[11px] text-blue-600 font-semibold leading-tight">{user?.role || 'Staff'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;