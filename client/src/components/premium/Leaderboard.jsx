import React, { useState, useEffect } from 'react';
import Spinner from '../common/Spinner';
import { getLeaderboard } from '../../services/premiumService';
import { formatCurrency } from '../../utils/formatters';

/**
 * Leaderboard Component
 * Displays top spenders (premium feature)
 */
const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLeaderboard();
      setLeaderboard(response.data.leaderboard || []);
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setError(err.response?.data?.error?.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-warning-400 to-warning-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            1
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-secondary-300 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            2
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            3
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600 font-semibold text-sm">
            {rank}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8">
        <div className="flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <div className="flex items-center gap-3 text-danger-600">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-8">
        <div className="text-center text-secondary-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-secondary-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="text-sm">No leaderboard data available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-warning-500 to-warning-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h2 className="text-xl font-bold text-white">Top Spenders Leaderboard</h2>
        </div>
        <p className="text-white/80 text-sm mt-1">See how you rank among all users</p>
      </div>

      {/* Leaderboard List */}
      <div className="divide-y divide-secondary-200">
        {leaderboard.map((entry) => (
          <div
            key={entry.rank}
            className={`px-6 py-4 flex items-center justify-between hover:bg-secondary-50 transition-colors ${
              entry.rank <= 3 ? 'bg-secondary-50/50' : ''
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Rank */}
              <div className="flex-shrink-0">
                {getMedalIcon(entry.rank)}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${
                  entry.rank <= 3 ? 'text-secondary-900' : 'text-secondary-700'
                }`}>
                  {entry.name}
                </p>
              </div>

              {/* Total Expenses */}
              <div className="text-right">
                <p className={`font-bold ${
                  entry.rank === 1 ? 'text-warning-600 text-lg' :
                  entry.rank === 2 ? 'text-secondary-600 text-lg' :
                  entry.rank === 3 ? 'text-orange-600 text-lg' :
                  'text-secondary-700'
                }`}>
                  {formatCurrency(entry.totalExpenses)}
                </p>
                <p className="text-xs text-secondary-500">Total Spent</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {leaderboard.length >= 100 && (
        <div className="bg-secondary-50 px-6 py-3 text-center">
          <p className="text-xs text-secondary-600">
            Showing top 100 spenders
          </p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
