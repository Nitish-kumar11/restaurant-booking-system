const router = require('express').Router();
const { getTables } = require('../controllers/tableController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTables);

module.exports = router;
