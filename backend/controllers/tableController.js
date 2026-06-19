const Table = require('../models/Table');

// @GET /api/tables
exports.getTables = async (req, res) => {
  try {
    const tables = await Table.find({ isActive: true }).sort('tableNumber');
    res.json({ success: true, tables });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
