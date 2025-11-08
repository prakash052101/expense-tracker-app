import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

/**
 * PremiumBanner Component
 * Call-to-action banner to encourage users to upgrade to premium
 */
const PremiumBanner = ({ onUpgradeClick }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      navigate('/premium');
    }
  };

  return (
    <div className="bg-gradient-to-r from-warning-400 to-warning-600 rounded-lg p-6 text-white shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">Upgrade to Premium</h3>
            <p className="text-white/90 text-sm">
              Unlock advanced features including leaderboard access, priority support, and more!
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Button
            variant="secondary"
            onClick={handleUpgrade}
            className="bg-white text-warning-600 hover:bg-white/90 font-semibold shadow-md"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumBanner;
