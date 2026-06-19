const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const guard = [protect, adminOnly];

router.get('/dashboard',            ...guard, ctrl.getDashboard);
router.get('/bookings',             ...guard, ctrl.getAllBookings);
router.put('/bookings/:id/status',  ...guard, ctrl.updateBookingStatus);
router.get('/users',                ...guard, ctrl.getAllUsers);
router.put('/users/:id/toggle',     ...guard, ctrl.toggleUserStatus);
router.get('/tables',               ...guard, ctrl.getTables);
router.post('/tables',              ...guard, ctrl.createTable);
router.put('/tables/:id',           ...guard, ctrl.updateTable);
router.delete('/tables/:id',        ...guard, ctrl.deleteTable);

module.exports = router;
