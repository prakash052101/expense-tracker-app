import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PremiumBanner, PaymentModal, Leaderboard } from '../components/premium';
import Button from '../components/common/Button';

/**
 * Premium Page
 * Displays premium features, pricing, and leaderboard for premium users
 */
const Premium = () => {
  const { isPremium } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleUpgradeClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  const premiumFeatures = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      title: 'Leaderboard Access',
      description: 'See how you rank among top spenders and compete with other users',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Priority Support',
      description: 'Get faster response times and dedicated support for your queries',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Premium Badge',
      description: 'Display your premium status with an exclusive badge across the platform',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Early Access',
      description: 'Be the first to try new features and updates before general release',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Advanced Analytics',
      description: 'Access detailed insights and analytics about your spending patterns',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      title: 'Custom Categories',
      description: 'Create unlimited custom categories to organize your expenses',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 bg-success-50 border border-success-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-success-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-success-900">Welcome to Premium!</p>
              <p className="text-sm text-success-700">Your premium subscription has been activated successfully.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-warning-400 to-warning-600 rounded-full mb-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-secondary-900 mb-3">
          {isPremium() ? 'You are Premium!' : 'Upgrade to Premium'}
        </h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          {isPremium()
            ? 'Enjoy all the exclusive features and benefits of your premium membership'
            : 'Unlock advanced features and take your expense tracking to the next level'}
        </p>
      </div>

      {/* Premium Status or Upgrade Banner */}
      {isPremium() ? (
        <div className="mb-12">
          <div className="bg-gradient-to-r from-success-50 to-success-100 border border-success-200 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-success-900 mb-1">Premium Member</h3>
                <p className="text-success-700">You have lifetime access to all premium features</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-12">
          <PremiumBanner onUpgradeClick={handleUpgradeClick} />
        </div>
      )}

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-secondary-900 mb-6 text-center">Premium Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-secondary-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-warning-100 text-warning-600 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">{feature.title}</h3>
              <p className="text-secondary-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Card (for non-premium users) */}
      {!isPremium() && (
        <div className="mb-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg border-2 border-warning-500 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-warning-500 to-warning-600 px-6 py-4 text-center">
                <h3 className="text-2xl font-bold text-white">Premium Plan</h3>
              </div>
              <div className="p-8 text-center">
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-bold text-secondary-900">₹45</span>
                    <span className="text-xl text-secondary-600">/ lifetime</span>
                  </div>
                  <p className="text-sm text-secondary-500">One-time payment, no recurring charges</p>
                </div>
                <Button
                  variant="primary"
                  onClick={handleUpgradeClick}
                  className="w-full bg-warning-500 hover:bg-warning-600 text-lg py-3"
                >
                  Upgrade Now
                </Button>
                <p className="text-xs text-secondary-500 mt-4">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard (for premium users only) */}
      {isPremium() && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6 text-center">Leaderboard</h2>
          <Leaderboard />
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Premium;
