import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardNavbar = ({ isSidebarCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isSidebarCollapsed);
  // Simple breadcrumb logic for demo
  const pathnames = location.pathname.split('/').filter((x) => x);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    document.dispatchEvent(new CustomEvent('toggleSidebar', { detail: { collapsed: !sidebarCollapsed } }));
  };

  const getInitials = (user) => {
    if (!user) return '?';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.name) {
      const parts = user.name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return '?';
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  // Dynamic left and width for navbar at lg and above
  const left = isSidebarCollapsed ? '5rem' : '16rem';
  const width = isSidebarCollapsed ? 'calc(100% - 5rem)' : 'calc(100% - 16rem)';

  return (
    <nav
      className={`bg-white border border-gray-200 shadow-md h-20 flex items-center fixed top-0 z-40 px-4 w-full transition-all duration-200`}
      style={{ left: undefined, width: undefined, ...(window.innerWidth >= 1024 ? { left, width } : { left: 0, width: '100%' }) }}
    >
      {/* Sidebar Toggle Button (hidden on home, visible on dashboard) */}
      {location.pathname.startsWith('/dashboard') && (
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none mr-4 lg:block"
        >
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      {/* Center/Left: Breadcrumbs and Page Title */}
      <div className="flex flex-col justify-center ml-2 flex-1">
        <div className="flex items-center text-xs text-gray-400 font-medium space-x-1">
          <span>Pages</span>
          {pathnames.map((name, idx) => (
            <span key={idx} className="flex items-center">
              <span className="mx-1">/</span>
              <span className="capitalize">{name}</span>
            </span>
          ))}
        </div>
        <div className="text-lg font-semibold text-gray-800 leading-tight mt-1">
          {pathnames.length > 0 ? pathnames[pathnames.length - 1].charAt(0).toUpperCase() + pathnames[pathnames.length - 1].slice(1) : 'Dashboard'}
        </div>
      </div>
      {/* Right: Search, User/Sign In, Settings, Notification */}
      <div className="flex items-center gap-4 min-w-max">
        {/* Search Bar */}
        <div className="relative hidden sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-2-2" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Type here..."
            className="block w-48 pl-8 pr-3 py-1.5 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white text-sm"
          />
        </div>
        {/* User Avatar/Dropdown or Sign In */}
        {user ? (
          <div className="relative">
            <button
              className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-600 focus:outline-none"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                getInitials(user)
              )}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-semibold text-gray-800 text-sm">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </div>
                <Link
                  to="/dashboard"
                  className={`block px-4 py-2 text-sm ${location.pathname === '/dashboard' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/dashboard/profile"
                  className={`block px-4 py-2 text-sm ${location.pathname === '/dashboard/profile' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                {/* Settings and Notification in dropdown on small screens */}
                <div className="block lg:hidden">
                  <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="3" strokeWidth="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09A1.65 1.65 0 008.91 3.09V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33-1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                    </svg>
                    Settings
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Notifications
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="text-gray-500 hover:text-indigo-600 font-medium text-sm">Sign In</Link>
        )}
        {/* Settings Icon (hidden on small screens) */}
        <button className="p-2 rounded-full hover:bg-gray-100 hidden lg:block">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09A1.65 1.65 0 008.91 3.09V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33-1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
        {/* Notification Icon (hidden on small screens) */}
        <button className="p-2 rounded-full hover:bg-gray-100 hidden lg:block">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar; 