import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProfileSettings, PreferencesForm, PasswordChange } from '../components/profile';
import { updateProfile, changePassword, updatePreferences } from '../services/profileService';

/**
 * Profile Page
 * Displays user profile with tabbed interface for settings, preferences, and password change
 */
const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: '👤' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'password', label: 'Change Password', icon: '🔒' },
  ];

  const handleProfileUpdate = async (profileData) => {
    try {
      const response = await updateProfile(profileData);
      
      // Update user in context
      if (response.data?.user) {
        updateUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handlePreferencesUpdate = async (preferencesData) => {
    try {
      const response = await updatePreferences(preferencesData);
      
      // Update user preferences in context
      if (response.data?.preferences) {
        updateUser({ preferences: response.data.preferences });
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handlePasswordChange = async (passwordData) => {
    try {
      const response = await changePassword(passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your profile, preferences, and security settings
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm
                    transition-colors duration-200
                    ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <span className="mr-2">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <ProfileSettings
                user={user}
                onUpdate={handleProfileUpdate}
              />
            )}

            {activeTab === 'preferences' && (
              <PreferencesForm
                preferences={user?.preferences}
                onUpdate={handlePreferencesUpdate}
              />
            )}

            {activeTab === 'password' && (
              <PasswordChange
                onUpdate={handlePasswordChange}
              />
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Account Information
          </h3>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Account Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user?.ispremiumuser ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Premium Member
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Free Account
                  </span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Member Since</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user?.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Expenses</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user?.preferences?.currency || 'USD'} {user?.totalamount?.toFixed(2) || '0.00'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">User ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">
                {user?.id || 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;
