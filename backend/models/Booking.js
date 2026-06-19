const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId:   { type: String, unique: true },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  table:       { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  date:        { type: String, required: true },   // YYYY-MM-DD
  timeSlot:    { type: String, required: true },
  guests:      { type: Number, required: true, min: 1 },
  occasion:    { type: String, default: 'Regular Dining' },
  requests:    { type: String, default: '' },
  status:      { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  adminNote:   { type: String, default: '' },
  totalAmount: { type: Number, default: 0 },
}, { timestamps: true });

bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now().toString().slice(-8);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
