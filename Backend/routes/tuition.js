const express = require('express');
const router = express.Router();
const tuitionController = require('../controllers/tuitionController');
const auth = require('../middleware/auth');

router.get('/', auth, tuitionController.getAllTuition);
router.get('/stats', auth, tuitionController.getTuitionStats);
router.post('/', auth, tuitionController.createTuition);
router.put('/:id', auth, tuitionController.updateTuitionStatus);

module.exports = router;