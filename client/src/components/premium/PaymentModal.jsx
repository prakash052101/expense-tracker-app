import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { purchasePremium, verifyPremium } from '../../services/premiumService';
import { useAuth } from '../../contexts/AuthContext';

/**
 * PaymentModal Component
 * Handles Razorpay payment integration for premium subscription
 */
const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, updateUser } = useAuth();

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create order on backend
      const orderResponse = await purchasePremium();
      const { order, key_id } = orderResponse.data;

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
      }

      // Configure Razorpay options
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'ExpenseTracker Premium',
        description: 'Premium Subscription',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await verifyPremium({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            // Update user state with new token and premium status
            if (verifyResponse.data.token) {
              localStorage.setItem('token', verifyResponse.data.token);
            }
            
            updateUser({ ispremiumuser: true });

            // Call success callback
            if (onSuccess) {
              onSuccess();
            }

            onClose();
          } catch (err) {
            console.error('Payment verification failed:', err);
            setError(err.response?.data?.error?.message || 'Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#F59E0B', // warning-500
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      // Open Razorpay payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('Payment initiation failed:', err);
      setError(err.response?.data?.error?.message || err.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade to Premium">
      <div className="space-y-6">
        {/* Premium Features */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-secondary-900">Premium Features</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-secondary-900">Leaderboard Access</p>
                <p className="text-sm text-secondary-600">See how you rank among top spenders</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-secondary-900">Priority Support</p>
                <p className="text-sm text-secondary-600">Get faster response times for your queries</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-secondary-900">Premium Badge</p>
                <p className="text-sm text-secondary-600">Show off your premium status</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-secondary-900">Future Features</p>
                <p className="text-sm text-secondary-600">Early access to new features</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-br from-warning-50 to-warning-100 rounded-lg p-6 border border-warning-200">
          <div className="text-center">
            <p className="text-sm text-secondary-600 mb-2">One-time payment</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-bold text-secondary-900">₹45</span>
              <span className="text-lg text-secondary-600">/ lifetime</span>
            </div>
            <p className="text-xs text-secondary-500 mt-2">No recurring charges</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-danger-700">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-warning-500 hover:bg-warning-600"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" />
                Processing...
              </span>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </div>

        {/* Security Note */}
        <p className="text-xs text-center text-secondary-500">
          Secure payment powered by Razorpay. Your payment information is encrypted and secure.
        </p>
      </div>
    </Modal>
  );
};

export default PaymentModal;
