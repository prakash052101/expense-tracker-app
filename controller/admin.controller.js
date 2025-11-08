const User = require('../models/user.model');
const Order = require('../models/order.model');

/**
 * GET /api/admin/dashboard
 * Get admin dashboard with system-wide analytics
 * Returns user counts, premium counts, and revenue statistics
 */
exports.getDashboard = async (req, res) => {
  try {
    // Get user statistics
    const [totalUsers, premiumUsers, totalRevenue, recentOrders] = await Promise.all([
      // Total user count
      User.countDocuments(),
      
      // Premium user count
      User.countDocuments({ ispremiumuser: true }),
      
      // Total revenue from successful orders
      Order.aggregate([
        { $match: { status: 'success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      
      // Recent premium purchases (last 10)
      Order.find({ status: 'success' })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'name email')
        .lean()
    ]);

    // Calculate user growth for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Format user growth data
    const formattedGrowth = userGrowth.map(item => ({
      date: new Date(item._id.year, item._id.month - 1, item._id.day).toISOString().split('T')[0],
      count: item.count
    }));

    res.status(200).json({
      success: true,
      data: {
        userStats: {
          totalUsers,
          premiumUsers,
          freeUsers: totalUsers - premiumUsers,
          premiumPercentage: totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(2) : 0
        },
        revenue: {
          total: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
          currency: 'INR'
        },
        userGrowth: formattedGrowth,
        recentPurchases: recentOrders.map(order => ({
          orderId: order.orderid,
          paymentId: order.paymentid,
          amount: order.amount,
          currency: order.currency,
          user: {
            id: order.userId._id,
            name: order.userId.name,
            email: order.userId.email
          },
          date: order.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch admin dashboard data',
        code: 'ADMIN_DASHBOARD_ERROR'
      }
    });
  }
};

/**
 * GET /api/admin/users
 * Get list of all users with pagination and filtering
 * Query params: page (default: 1), limit (default: 20), premium (optional: true/false)
 */
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.premium !== undefined) {
      filter.ispremiumuser = req.query.premium === 'true';
    }

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      User.find(filter)
        .select('-password') // Exclude password field
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch users',
        code: 'FETCH_USERS_ERROR'
      }
    });
  }
};

/**
 * GET /api/admin/revenue
 * Get detailed revenue statistics
 * Query params: startDate (optional), endDate (optional)
 */
exports.getRevenue = async (req, res) => {
  try {
    // Build date filter
    const dateFilter = { status: 'success' };
    
    if (req.query.startDate) {
      const startDate = new Date(req.query.startDate);
      if (isNaN(startDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid startDate format',
            code: 'INVALID_DATE'
          }
        });
      }
      dateFilter.createdAt = { $gte: startDate };
    }

    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate);
      if (isNaN(endDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid endDate format',
            code: 'INVALID_DATE'
          }
        });
      }
      dateFilter.createdAt = dateFilter.createdAt || {};
      dateFilter.createdAt.$lte = endDate;
    }

    // Get revenue statistics
    const [totalRevenue, monthlyRevenue, revenueByStatus] = await Promise.all([
      // Total revenue
      Order.aggregate([
        { $match: dateFilter },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),

      // Monthly revenue breakdown
      Order.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': -1, '_id.month': -1 }
        },
        {
          $limit: 12 // Last 12 months
        }
      ]),

      // Revenue by status
      Order.aggregate([
        {
          $group: {
            _id: '$status',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Format monthly revenue data
    const formattedMonthlyRevenue = monthlyRevenue.map(item => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return {
        year: item._id.year,
        month: item._id.month,
        monthName: monthNames[item._id.month - 1],
        total: item.total,
        count: item.count,
        average: item.count > 0 ? (item.total / item.count).toFixed(2) : 0
      };
    });

    // Format revenue by status
    const formattedRevenueByStatus = {};
    revenueByStatus.forEach(item => {
      formattedRevenueByStatus[item._id] = {
        total: item.total,
        count: item.count
      };
    });

    res.status(200).json({
      success: true,
      data: {
        total: {
          amount: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
          count: totalRevenue.length > 0 ? totalRevenue[0].count : 0,
          average: totalRevenue.length > 0 && totalRevenue[0].count > 0 
            ? (totalRevenue[0].total / totalRevenue[0].count).toFixed(2) 
            : 0,
          currency: 'INR'
        },
        monthlyBreakdown: formattedMonthlyRevenue,
        byStatus: formattedRevenueByStatus
      }
    });
  } catch (error) {
    console.error('Error fetching revenue statistics:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to fetch revenue statistics',
        code: 'REVENUE_STATS_ERROR'
      }
    });
  }
};

module.exports = exports;
