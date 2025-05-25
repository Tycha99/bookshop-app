const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { requireRoles } = require('../middleware/auth');

router.get('/', bookController.list);
router.get('/add', requireRoles(['admin', 'seller']), bookController.showAddForm);
router.post('/add', requireRoles(['admin', 'seller']), bookController.addBook);

module.exports = router;
