const express = require('express');
const count = require('../controllers/count.controller');

const router = express.Router();

router.get('/', count);

module.exports = router;
