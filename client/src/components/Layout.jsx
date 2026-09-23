import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-blue-500 selection:text-white antialiased">
      <Sidebar />
      
      {/* Main content wrapper shifted right to accommodate fixed sidebar */}
      <div className="flex-1 ml-64 flex flex-col min-w-0 transition-all duration-300">
        <Header />
        
        {/* Main page container with soft subtle ambient glow and fluid max width */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;