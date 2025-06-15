import React from 'react';

const Settings = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      <div className="mt-6">
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {/* Profile Settings */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <input
                  id="email-notifications"
                  name="email-notifications"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="email-notifications" className="ml-3 block text-sm font-medium text-gray-700">
                  Email notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="push-notifications"
                  name="push-notifications"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="push-notifications" className="ml-3 block text-sm font-medium text-gray-700">
                  Push notifications
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="p-6">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 