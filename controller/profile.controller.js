const bcrypt = require('bcrypt');
const User = require('../models/user.model');

/**
 * Get user profile
 * GET /api/profile
 */
const getProfile = async (req, res) => {
  try {
    // User is already loaded by auth middleware
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          ispremiumuser: user.ispremiumuser,
          isAdmin: user.isAdmin,
          totalamount: user.totalamount,
          preferences: user.preferences,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to retrieve profile',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

/**
 * Update user profile (name, email)
 * PUT /api/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    // Validate at least one field is provided
    if (!name && !email) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'At least one field (name or email) is required',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // If email is being updated, check if it's already taken
    if (email && email.toLowerCase() !== req.user.email.toLowerCase()) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: {
            message: 'Email already in use',
            code: 'EMAIL_EXISTS'
          }
        });
      }
    }

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          ispremiumuser: updatedUser.ispremiumuser,
          isAdmin: updatedUser.isAdmin,
          totalamount: updatedUser.totalamount,
          preferences: updatedUser.preferences
        }
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update profile',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

/**
 * Change user password
 * PUT /api/profile/password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Current password and new password are required',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'New password must be at least 6 characters long',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Get user with password field
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Current password is incorrect',
          code: 'INVALID_PASSWORD'
        }
      });
    }

    // Hash new password with 10 rounds
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to change password',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

/**
 * Update user preferences (currency, timezone, monthlyBudget)
 * PUT /api/profile/preferences
 */
const updatePreferences = async (req, res) => {
  try {
    const { currency, timezone, monthlyBudget } = req.body;
    const userId = req.user._id;

    // Validate at least one preference field is provided
    if (currency === undefined && timezone === undefined && monthlyBudget === undefined) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'At least one preference field is required',
          code: 'VALIDATION_ERROR'
        }
      });
    }

    // Build preferences update object
    const preferencesUpdate = {};
    if (currency !== undefined) preferencesUpdate['preferences.currency'] = currency;
    if (timezone !== undefined) preferencesUpdate['preferences.timezone'] = timezone;
    if (monthlyBudget !== undefined) {
      // Validate monthlyBudget is a positive number or null
      if (monthlyBudget !== null && (typeof monthlyBudget !== 'number' || monthlyBudget < 0)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Monthly budget must be a positive number or null',
            code: 'VALIDATION_ERROR'
          }
        });
      }
      preferencesUpdate['preferences.monthlyBudget'] = monthlyBudget;
    }

    // Update user preferences
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: preferencesUpdate },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        preferences: updatedUser.preferences
      },
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to update preferences',
        code: 'INTERNAL_ERROR'
      }
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  updatePreferences
};
