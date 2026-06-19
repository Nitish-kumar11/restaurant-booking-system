const Booking = require('../models/Booking');
const Table   = require('../models/Table');

// Check if a table is already booked for a given date+time
const isTableTaken = async (tableId, date, timeSlot, excludeId = null) => {
  const query = { table: tableId, date, timeSlot, status: { $in: ['pending', 'confirmed'] } };
  if (excludeId) query._id = { $ne: excludeId };
  return !!(await Booking.findOne(query));
};

// @POST /api/bookings  — create booking (user)
exports.createBooking = async (req, res) => {
  try {
    const { tableId, date, timeSlot, guests, occasion, requests } = req.body;
    if (!tableId || !date || !timeSlot || !guests)
      return res.status(400).json({ success: false, message: 'Table, date, time and guests are required' });

    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ success: false, message: 'Table not found' });

    if (await isTableTaken(tableId, date, timeSlot))
      return res.status(409).json({ success: false, message: 'This table is already booked for that slot' });

    const booking = await Booking.create({
      user: req.user._id, table: tableId, date, timeSlot,
      guests, occasion: occasion || 'Regular Dining', requests: requests || '',
    });
    await booking.populate(['user', 'table']);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/bookings/my  — my bookings (user)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('table')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/bookings/availability?date=&timeSlot=  — check availability
exports.checkAvailability = async (req, res) => {
  try {
    const { date, timeSlot } = req.query;
    const tables   = await Table.find({ isActive: true });
    const booked   = await Booking.find({ date, timeSlot, status: { $in: ['pending','confirmed'] } }).select('table');
    const bookedIds = booked.map(b => b.table.toString());
    const result   = tables.map(t => ({ ...t.toObject(), isBooked: bookedIds.includes(t._id.toString()) }));
    res.json({ success: true, tables: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/bookings/:id/cancel  — cancel (user own)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === 'cancelled')
      return res.status(400).json({ success: false, message: 'Already cancelled' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
