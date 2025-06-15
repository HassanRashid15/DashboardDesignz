import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 h-20 flex items-center w-full fixed top-0 left-0 z-40">
      <div className="w-full flex items-center justify-between px-8">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="4" strokeWidth="2" />
            <path d="M7 7h10v10H7z" strokeWidth="2" />
          </svg>
          <span className="font-bold text-lg text-gray-800 tracking-wide hidden md:block">PURITY UI DASHBOARD</span>
        </div>
        {/* Search Bar */}
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-2-2" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Type here..."
              className="block w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white text-sm"
            />
          </div>
        </div>
        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <button className="p-2 rounded-full hover:bg-gray-100">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
          </button>
          {/* Sign In Link */}
          <Link to="/login" className="text-gray-500 hover:text-indigo-600 font-medium text-sm hidden md:block">Sign In</Link>
          {/* Profile Avatar */}
          <button className="ml-2 flex items-center">
            <img className="h-8 w-8 rounded-full border-2 border-indigo-100" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="profile" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 