import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleToggleSidebar = (event) => {
      setIsSidebarCollapsed(event.detail.collapsed);
    };

    document.addEventListener('toggleSidebar', handleToggleSidebar);
    return () => {
      document.removeEventListener('toggleSidebar', handleToggleSidebar);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar isSidebarCollapsed={isSidebarCollapsed} />
      <Sidebar />
      <div className={`pt-20 transition-all duration-200 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 