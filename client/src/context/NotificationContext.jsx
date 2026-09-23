import React, { createContext, useState, useEffect } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const initialNotifications = [
    {
      id: 'notif-1',
      title: 'High-Value Lead Qualified',
      message: 'Global Tech Systems moved to closing stage ($45,000).',
      time: '10m ago',
      read: false,
      type: 'lead',
      link: '/leads'
    },
    {
      id: 'notif-2',
      title: 'Action Item Due Today',
      message: 'Follow-up call with VP of Procurement scheduled for 3:00 PM.',
      time: '1h ago',
      read: false,
      type: 'task',
      link: '/tasks'
    },
    {
      id: 'notif-3',
      title: 'New Account Onboarded',
      message: 'Sarah Jenkins registered under Enterprise tier.',
      time: '3h ago',
      read: true,
      type: 'customer',
      link: '/customers'
    },
    {
      id: 'notif-4',
      title: 'Security Session Verified',
      message: 'Logged in successfully with active role credentials.',
      time: '5h ago',
      read: true,
      type: 'security',
      link: '/dashboard'
    }
  ];

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('crm360_notifications');
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('crm360_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to cache notifications:', e);
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const addNotification = ({ title, message, type = 'system', link = '/dashboard' }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      read: false,
      type,
      link
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => React.useContext(NotificationContext);
