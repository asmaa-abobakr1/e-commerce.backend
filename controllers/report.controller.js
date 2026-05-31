const Order = require('../models/order.model');

exports.getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = {
      orderAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      status: { $nin: ['cancelbyuser', 'canceledbyadmin'] } 
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

    res.status(200).json({
      status: 'success',
      data: {
        summary: stats[0] || { totalRevenue: 0, totalOrders: 0 },
        dailyStats
      }
    });
  } catch (err) { next(err); }
};
