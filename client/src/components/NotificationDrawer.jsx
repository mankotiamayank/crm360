import React, { useContext, useState, useRef, useEffect } from 'react';
import { NotificationContext } from '../context/NotificationContext.jsx';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Check, 
  Trash2, 
  X, 
  Briefcase, 
  CheckSquare, 
  User, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

const NotificationDrawer = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll 
  } = useContext(NotificationContext);

  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredList = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const handleItemClick = (notif) => {
    markAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
      onClose();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'lead':
        return <Briefcase size={16} className="text-amber-500" />;
      case 'task':
        return <CheckSquare size={16} className="text-emerald-500" />;
      case 'customer':
        return <User size={16} className="text-blue-500" />;
      default:
        return <ShieldCheck size={16} className="text-purple-500" />;
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center space-x-2">
          <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center space-x-1"
            >
              <Check size={13} />
              <span>Mark all read</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              title="Clear all"
              className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2 border-b border-slate-100 flex items-center space-x-2 bg-white">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            filter === 'unread'
              ? 'bg-slate-900 text-white'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
        {filteredList.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-2">
              <Bell size={20} />
            </div>
            <p className="text-xs font-semibold text-slate-700">No notifications</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {filter === 'unread' ? 'All notifications have been read.' : 'You have no alerts at this time.'}
            </p>
          </div>
        ) : (
          filteredList.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif)}
              className={`p-3.5 flex items-start space-x-3 cursor-pointer transition-colors group relative ${
                !notif.read ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-slate-200/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-bold truncate ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                    {notif.title}
                  </p>
                  <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{notif.time}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-1 flex-shrink-0">
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded-md transition-opacity"
                  title="Dismiss"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50/80 border-t border-slate-100 text-center text-[11px] text-slate-400 font-medium">
        Live Notification Stream • Updates in Real-Time
      </div>
    </div>
  );
};

export default NotificationDrawer;
