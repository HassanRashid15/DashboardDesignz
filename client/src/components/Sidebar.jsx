import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const mainLinks = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    path: '/dashboard/tables',
    name: 'Tables',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" stroke="currentColor" fill="none" />
        <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2" stroke="currentColor" />
        <line x1="9" y1="21" x2="9" y2="9" strokeWidth="2" stroke="currentColor" />
      </svg>
    ),
  },
  {
    path: '/dashboard/billing',
    name: 'Billing',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" strokeWidth="2" stroke="currentColor" fill="none" />
        <path d="M16 3v4M8 3v4M2 11h20" strokeWidth="2" stroke="currentColor" />
      </svg>
    ),
  },
  {
    path: '/dashboard/rtl',
    name: 'RTL',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16M4 8h16M4 12h16M4 16h16M4 20h16" />
      </svg>
    ),
  },
];

// accountLinks now only contains Profile, Sign In, Sign Up will be rendered conditionally
const accountLinks = [
  {
    path: '/dashboard/profile',
    name: 'Profile',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" strokeWidth="2" stroke="currentColor" fill="none" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      </svg>
    ),
  },
];

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

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);

  useEffect(() => {
    const handleToggleSidebar = (event) => {
      if (window.innerWidth <= 850) {
        setIsMobileOpen((prev) => !prev);
      } else {
        setIsCollapsed(event.detail.collapsed);
      }
    };
    document.addEventListener('toggleSidebar', handleToggleSidebar);
    return () => {
      document.removeEventListener('toggleSidebar', handleToggleSidebar);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 850) setIsMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    setShowLogoutDropdown(false);
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        className={`h-screen bg-white border border-gray-200 shadow-md flex flex-col fixed top-0 z-50 transition-all duration-200
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'left-0' : '-left-64'}
          lg:left-0
          ${isMobileOpen ? '' : 'lg:z-30'}
        `}
        style={{ transition: 'left 0.3s, width 0.2s' }}
      >
        {/* Logo and Title at the top */}
        <div className={`flex items-center gap-2 h-20 px-6 border-b border-gray-100 justify-center ${isCollapsed ? 'justify-center' : ''}`}>
          <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="2" />
            <path d="M7 7h10v10H7z" strokeWidth="2" />
          </svg>
          {!isCollapsed && (
            <span className="font-bold text-base text-gray-800 tracking-wide uppercase ml-2">PURITY UI DASHBOARD</span>
          )}
        </div>

        {/* Main Links */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="mb-6">
            {mainLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `relative group flex items-center gap-3 py-3 mb-2 font-medium transition-all text-base rounded-lg px-4 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Left border indicator positioned at the very left edge of sidebar */}
                    {isActive && (
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>
                    )}
                    {item.icon}
                    {isCollapsed && (
                      <div className="fixed left-[88px] px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-[99] bg-red-500">
                        {item.name}
                      </div>
                    )}
                    {!isCollapsed && <span>{item.name}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Section Header */}
          {!isCollapsed && (
            <div className="text-xs font-semibold text-gray-400 px-4 mt-8 mb-2">ACCOUNT PAGES</div>
          )}
          <div>
            {user ? (
              <NavLink
                key="/dashboard/profile"
                to="/dashboard/profile"
                end
                className={({ isActive }) =>
                  `relative group flex items-center gap-3 py-3 mb-2 font-medium transition-all text-base rounded-lg px-4 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Left border indicator positioned at the very left edge of sidebar */}
                    {isActive && (
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>
                    )}
                    {/* Profile Icon */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" strokeWidth="2" stroke="currentColor" fill="none" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                    </svg>
                    {isCollapsed && (
                      <div className="fixed left-[88px] px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-[99] bg-red-500">
                        Profile
                      </div>
                    )}
                    {!isCollapsed && <span>Profile</span>}
                  </>
                )}
              </NavLink>
            ) : (
              <>
                <NavLink
                  key="/login"
                  to="/login"
                  end
                  className={({ isActive }) =>
                    `relative group flex items-center gap-3 py-3 mb-2 font-medium transition-all text-base rounded-lg px-4 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Left border indicator positioned at the very left edge of sidebar */}
                      {isActive && (
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>
                      )}
                      {/* Sign In Icon */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                      {!isCollapsed && <span>Sign In</span>}
                    </>
                  )}
                </NavLink>
                <NavLink
                  key="/signup"
                  to="/signup"
                  end
                  className={({ isActive }) =>
                    `relative group flex items-center gap-3 py-3 mb-2 font-medium transition-all text-base rounded-lg px-4 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Left border indicator positioned at the very left edge of sidebar */}
                      {isActive && (
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>
                      )}
                      {/* Sign Up Icon */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      {!isCollapsed && <span>Sign Up</span>}
                    </>
                  )}
                </NavLink>
              </>
            )}
          </div>

          {/* Help Card */}
          {!isCollapsed && (
            <div className="mt-10 px-4">
              <div className="bg-teal-100 rounded-2xl p-4 flex flex-col items-start">
                <div className="flex items-center mb-2">
                  <svg className="w-6 h-6 text-teal-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                  </svg>
                  <span className="font-semibold text-teal-700">Need help?</span>
                </div>
                <p className="text-teal-700 text-sm mb-3">Please, check our docs</p>
                <a href="#" className="bg-white text-teal-600 px-3 py-1 rounded-full text-xs font-semibold shadow hover:bg-teal-50">DOCUMENTATION</a>
              </div>
            </div>
          )}
        </nav>

        {/* User Profile/Sign In at the bottom */}  
        {user && (
          <div className={`mt-auto p-4 border-t border-gray-100 ${isCollapsed ? 'justify-center flex-col items-center' : ''}`}>
            <button
              className={`flex items-center gap-3 w-full text-left rounded-md p-2 hover:bg-gray-100 focus:outline-none ${isCollapsed ? 'flex-col justify-center text-center' : ''}`}
              onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-600 flex-shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(user)
                )}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col flex-1">
                  <div className="text-sm font-semibold text-gray-800">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-gray-400">{user.email}</div>
                </div>
              )}
            </button>

            {showLogoutDropdown && !isCollapsed && (
              <div className="w-full mt-2">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;