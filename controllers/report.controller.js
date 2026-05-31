const Order = require('../models/order.model');
const AppError = require('../utilites/appError.uti');

exports.getSalesReport = async (req, res, next) => {
  try {
    let { startDate, endDate } = req.query;
    
    // 1. تأمين التواريخ لو متبعتتش (الافتراضي: آخر 30 يوم)
    if (!startDate) {
      const defaultStart = new Date();
      defaultStart.setDate(defaultStart.getDate() - 30);
      startDate = defaultStart.toISOString();
    }
    if (!endDate) {
      endDate = new Date().toISOString();
    }

    // 2. تجميع كل حالات الإلغاء والرفض لضمان دقة الأرباح
    const filter = {
      orderAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      },
      status: { $nin: ['cancelbyuser', 'cancelbyadmin', 'canceledbyadmin', 'refused'] } 
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
        // 3. تأمين الـ Summary بالكامل في حال عدم وجود مبيعات
        summary: stats[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
        dailyStats
      }
    });
  } catch (err) { next(err); }
};