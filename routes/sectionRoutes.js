const express = require('express');
const router = express.Router();
const { addSection, addSubcategory, getSections } = require('../controllers/sectionController');

console.log('✅ sectionRoutes.js loaded');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: '✅ Sections route working!' });
});

// CRUD routes
router.get('/', getSections);
router.post('/add', addSection);
router.post('/add-sub', addSubcategory);

module.exports = router;
