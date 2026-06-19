const User    = require('../models/User');
const Booking = require('../models/Booking');
const Table   = require('../models/Table');

// @GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalBookings, totalTables, bookings] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments(),
      Table.countDocuments({ isActive: true }),
      Booking.find().populate('user', 'name email').populate('table').sort({ createdAt: -1 }).limit(10),
    ]);

    const confirmed  = await Booking.countDocuments({ status: 'confirmed' });
    const cancelled  = await Booking.countDocuments({ status: 'cancelled' });
    const pending    = await Booking.countDocuments({ status: 'pending' });
    const completed  = await Booking.countDocuments({ status: 'completed' });

    // Bookings per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = await Booking.find({ createdAt: { $gte: sevenDaysAgo } });

    // Group by date
    const byDay = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      byDay[key] = 0;
    }
    recent.forEach(b => {
      const key = b.createdAt.toISOString().split('T')[0];
      if (byDay[key] !== undefined) byDay[key]++;
    });

    res.json({
      success: true,
      stats: { totalUsers, totalBookings, totalTables, confirmed, cancelled, pending, completed },
      recentBookings: bookings,
      chartData: Object.entries(byDay).map(([date, count]) => ({ date, count })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/admin/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (date)   filter.date = date;
    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      Booking.find(filter).populate('user','name email phone').populate('table').sort({ createdAt: -1 }).skip(skip).limit(+limit),
      Booking.countDocuments(filter),
    ]);
    res.json({ success: true, bookings, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/admin/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    ).populate('user','name email').populate('table');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    // Add booking count per user
    const usersWithCount = await Promise.all(users.map(async u => {
      const count = await Booking.countDocuments({ user: u._id });
      return { ...u.toObject(), bookingCount: count };
    }));
    res.json({ success: true, users: usersWithCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/admin/users/:id/toggle
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/admin/tables
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort('tableNumber');
    res.json({ success: true, tables });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/admin/tables
exports.createTable = async (req, res) => {
  try {
    const table = await Table.create(req.body);
    res.status(201).json({ success: true, table });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/admin/tables/:id
exports.updateTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, table });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/admin/tables/:id
exports.deleteTable = async (req, res) => {
  try {
    await Table.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Table deactivated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
