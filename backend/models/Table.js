const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  seats:       { type: Number, required: true },
  section:     { type: String, enum: ['Window', 'Main Hall', 'Family', 'Banquet', 'Garden', 'VIP'], required: true },
  description: { type: String, default: '' },
  isActive:    { type: Boolean, default: true },
  status:      { type: String, enum: ['available', 'maintenance'], default: 'available' },
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
