import React from 'react';
import { useAuth } from '../context/AuthContext';

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

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString();
};

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="text-center text-gray-500">No user data found. Please log in.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6 max-w-full mx-auto flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 mb-4">
          {user.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            getInitials(user)
          )}
          
        </div>
        
        <div className=" flex flex-wrap w-full">
          <div className="mb-4 w-1/2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">First Name</label>
            <div className="text-gray-900 text-base">{user.firstName || '-'}</div>
          </div>
          <div className="mb-4 w-1/2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Last Name</label>
            <div className="text-gray-900 text-base">{user.lastName || '-'}</div>
          </div>
          <div className="mb-4 w-1/2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address</label>
            <div className="text-gray-900 text-base">{user.email || '-'}</div>
          </div>
          <div className="mb-4 w-1/2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">ID</label>
            <div className="text-gray-900 text-base">{user.id || '-'}</div>
          </div>
          <div className="mb-4 w-1/2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Created At</label>
            <div className="text-gray-900 text-base">{formatDate(user.createdAt)}</div>
          </div>
          <div className="mb-4 w-1/2">
            <label className="block text-xs font-semibold text-gray-500 mb-1">Updated At</label>
            <div className="text-gray-900 text-base">{formatDate(user.updatedAt)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 