const express = require('express');
const sign = require('../controllers/sign.controller');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, sign);

module.exports = router;
