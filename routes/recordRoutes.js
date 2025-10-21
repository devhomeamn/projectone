const express = require('express');
const router = express.Router();
const { addRecord, getRecords, moveToCentral } = require('../controllers/recordController');

console.log('✅ recordRoutes.js loaded');

router.post('/add', addRecord);
router.get('/', getRecords);
router.put('/move/:id', moveToCentral); // ✅ move to central

module.exports = router;
