import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Bell } from 'lucide-react';
import GlobalSearch from './GlobalSearch.jsx';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-8">
      
      {/* 🚨 This is the magic line that connects your new search bar to the UI */}
      <div className="w-1/3">
        <GlobalSearch />
      </div>

      {/* User Info & Notifications */}
      <div className="flex items-center space-x-6">
        <button className="text-gray-500 hover:text-blue-600 transition relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l pl-6 border-gray-200">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.role || 'Role'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;