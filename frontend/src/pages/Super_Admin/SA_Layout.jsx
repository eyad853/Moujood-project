import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SA_Sidebar from '../../components/SA_Sidebar/SA_Sidebar';
import SA_Navbar from '../../components/Nav/Nav';

const SA_Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <SA_Sidebar />
      </div>

      {/* Sidebar - Mobile (Overlay) */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-neutral-500/50 bg-opacity-50 z-40"
            onClick={toggleSidebar}
          ></div>
          
          {/* Sidebar */}
          <div className="lg:hidden fixed left-0 top-0 bottom-0 z-50">
            <SA_Sidebar />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Navbar */}
        <SA_Navbar onMenuToggle={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SA_Layout;