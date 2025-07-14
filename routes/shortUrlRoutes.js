// routes/shorturls.js
const express = require('express');
const { generateShortUrl, getShortUrl, getAllShortUrls } = require('../controllers/shortUrlController');
const router = express.Router();


router.post('/', generateShortUrl);

router.get('/', getAllShortUrls);

router.get('/:code', getShortUrl);

module.exports = router;
