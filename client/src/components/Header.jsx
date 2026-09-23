import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { NotificationContext } from '../context/NotificationContext.jsx';
import { Bell, Sparkles, Sliders } from 'lucide-react';
import GlobalSearch from './GlobalSearch.jsx';
import NotificationDrawer from './NotificationDrawer.jsx';
import ProfileModal from './ProfileModal.jsx';

const Header = () => {
  const { user } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/85 border-b border-slate-200/80 h-16 flex items-center justify-between px-6 lg:px-8 transition-colors">
        
        {/* Global Search Component */}
        <div className="w-full max-w-md">
          <GlobalSearch />
        </div>

        {/* Right Controls: System Status, Notifications & User Avatar */}
        <div className="flex items-center space-x-3 lg:space-x-5">
          {/* Live Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Sync</span>
          </div>

          {/* Interactive Notifications Button & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              aria-label="Notifications"
              className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                isNotifOpen 
                  ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-500/20' 
                  : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
              }`}
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            <NotificationDrawer 
              isOpen={isNotifOpen} 
              onClose={() => setIsNotifOpen(false)} 
            />
          </div>
          
          {/* Interactive User Profile Trigger */}
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center space-x-3 pl-3 py-1 pr-2 rounded-2xl hover:bg-slate-100/80 border border-transparent hover:border-slate-200 transition-all text-left group"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white group-hover:scale-105 transition-transform">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                {user?.name || 'Administrator'}
              </p>
              <div className="flex items-center space-x-1">
                <span className="text-[11px] text-blue-600 font-semibold leading-tight">{user?.role || 'Staff'}</span>
                <span className="text-[10px] text-slate-400">• Manage</span>
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* Profile & Role Command Center Modal */}
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
};

export default Header;