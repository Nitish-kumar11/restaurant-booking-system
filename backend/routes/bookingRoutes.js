const router = require('express').Router();
const { createBooking, getMyBookings, checkAvailability, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',               protect, createBooking);
router.get('/my',              protect, getMyBookings);
router.get('/availability',    protect, checkAvailability);
router.put('/:id/cancel',      protect, cancelBooking);

module.exports = router;
