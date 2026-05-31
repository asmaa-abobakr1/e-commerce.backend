const Order = require('../models/order.model');

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'fail',
        message: 'startDate and endDate are required'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    // Include the whole end day
    end.setHours(23, 59, 59, 999);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    const filter = {
      orderAt: { $gte: start, $lte: end },
      status: { $nin: ['cancelbyuser', 'canceledbyadmin'] },
      isDeleted: { $ne: true }
    };

    const stats = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalPrice' }
        }
      }
    ]);

    const dailyStats = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderAt" } },
          revenue: { $sum: "$totalPrice" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        summary: stats[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
        dailyStats
      }
    });
  } catch (err) {
    console.error('Sales report error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to generate sales report'
    });
  }
};
