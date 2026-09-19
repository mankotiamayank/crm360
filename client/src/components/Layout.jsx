import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* 🚨 The ml-64 is the magic fix! It pushes the content to the right of the 64-width fixed sidebar */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Header />
        
        {/* overflow-x-auto ensures large tables never stretch off the screen */}
        <main className="flex-1 p-8 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;