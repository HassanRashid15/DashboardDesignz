import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("preferences");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/dashboard/settings"
      );
      setSettings(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch settings");
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/dashboard/settings/preferences",
        newPreferences
      );
      setSettings((prev) => ({
        ...prev,
        preferences: response.data.preferences,
      }));
    } catch (err) {
      setError("Failed to update preferences");
    }
  };

  const updateNotificationSettings = async (newSettings) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/dashboard/settings/notifications",
        newSettings
      );
      setSettings((prev) => ({
        ...prev,
        notificationSettings: response.data.notificationSettings,
      }));
    } catch (err) {
      setError("Failed to update notification settings");
    }
  };

  const updateSystemSettings = async (newSettings) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/dashboard/settings/system",
        newSettings
      );
      setSettings((prev) => ({
        ...prev,
        systemSettings: response.data.systemSettings,
      }));
    } catch (err) {
      setError("Failed to update system settings");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab("preferences")}
                className={`${
                  activeTab === "preferences"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`${
                  activeTab === "notifications"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("system")}
                className={`${
                  activeTab === "system"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
              >
                System Settings
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  User Preferences
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      value={settings?.preferences?.language}
                      onChange={(e) =>
                        updatePreferences({
                          ...settings.preferences,
                          language: e.target.value,
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Timezone
                    </label>
                    <select
                      value={settings?.preferences?.timezone}
                      onChange={(e) =>
                        updatePreferences({
                          ...settings.preferences,
                          timezone: e.target.value,
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">EST</option>
                      <option value="PST">PST</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date Format
                    </label>
                    <select
                      value={settings?.preferences?.dateFormat}
                      onChange={(e) =>
                        updatePreferences({
                          ...settings.preferences,
                          dateFormat: e.target.value,
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Notification Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings?.notificationSettings?.email}
                      onChange={(e) =>
                        updateNotificationSettings({
                          ...settings.notificationSettings,
                          email: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-700">
                      Email Notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings?.notificationSettings?.push}
                      onChange={(e) =>
                        updateNotificationSettings({
                          ...settings.notificationSettings,
                          push: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-700">
                      Push Notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings?.notificationSettings?.taskReminders}
                      onChange={(e) =>
                        updateNotificationSettings({
                          ...settings.notificationSettings,
                          taskReminders: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-700">
                      Task Reminders
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings?.notificationSettings?.projectUpdates}
                      onChange={(e) =>
                        updateNotificationSettings({
                          ...settings.notificationSettings,
                          projectUpdates: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 block text-sm font-medium text-gray-700">
                      Project Updates
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  System Settings
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Dashboard Layout
                    </label>
                    <select
                      value={settings?.systemSettings?.dashboardLayout}
                      onChange={(e) =>
                        updateSystemSettings({
                          ...settings.systemSettings,
                          dashboardLayout: e.target.value,
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="default">Default</option>
                      <option value="compact">Compact</option>
                      <option value="detailed">Detailed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Default View
                    </label>
                    <select
                      value={settings?.systemSettings?.defaultView}
                      onChange={(e) =>
                        updateSystemSettings({
                          ...settings.systemSettings,
                          defaultView: e.target.value,
                        })
                      }
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="overview">Overview</option>
                      <option value="projects">Projects</option>
                      <option value="tasks">Tasks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Refresh Interval (seconds)
                    </label>
                    <input
                      type="number"
                      value={settings?.systemSettings?.refreshInterval}
                      onChange={(e) =>
                        updateSystemSettings({
                          ...settings.systemSettings,
                          refreshInterval: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      min="30"
                      max="3600"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
