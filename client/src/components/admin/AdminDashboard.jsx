import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import KPICard from '../dashboard/KPICard';
import UserStats from './UserStats';
import RevenueChart from './RevenueChart';
import { getAdminDashboard } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';

/**
 * AdminDashboard Component
 * Main admin dashboard displaying system-wide metrics and analytics
 */
const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminDashboard();
      setDashboardData(response.data);
    } catch (err) {
      console.error('Failed to fetch admin dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <span className="text-2xl mr-3">⚠️</span>
          <div>
            <h3 className="text-lg font-semibold text-red-800">Error Loading Dashboard</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const {
    totalUsers = 0,
    premiumUsers = 0,
    totalRevenue = 0,
    userGrowth = [],
    recentPurchases = [],
  } = dashboardData;

  const premiumPercentage = totalUsers > 0 
    ? ((premiumUsers / totalUsers) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          icon="👥"
          color="blue"
        />
        <KPICard
          title="Premium Users"
          value={premiumUsers.toLocaleString()}
          icon="⭐"
          color="purple"
          trendLabel={`${premiumPercentage}% of total`}
          trend="neutral"
        />
        <KPICard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon="💰"
          color="green"
        />
      </div>

      {/* User Stats and Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserStats userGrowth={userGrowth} />
        <RevenueChart recentPurchases={recentPurchases} />
      </div>

      {/* Recent Premium Purchases */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Premium Purchases
        </h3>
        
        {recentPurchases.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent purchases</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPurchases.map((purchase, index) => (
                  <tr key={purchase._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {purchase.userEmail || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(purchase.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          purchase.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : purchase.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

AdminDashboard.propTypes = {};

export default AdminDashboard;
