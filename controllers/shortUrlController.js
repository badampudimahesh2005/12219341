const {
  createShortUrl,
  getShortUrlStats,
  getAllUrls,
  registerClick,
  isValidShortcode,
} = require('../services/urlServices');


const generateShortUrl = (req, res) => {
  const { url, validity, shortcode } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  if (shortcode && (!isValidShortcode(shortcode) || shortcode in global.urls)) {
    return res.status(409).json({ error: 'Shortcode is invalid or already taken' });
  }

  const { code, expiry } = createShortUrl({ url, validity, shortcode });

  res.status(201).json({
    shortLink: `http://localhost:3000/${code}`,
    expiry,
  });
}

const getShortUrl = (req, res) => {
  const stats = getShortUrlStats(req.params.code);
  if (!stats) return res.status(404).json({ error: 'Shortcode not found' });

  res.json(stats);
}

const getAllShortUrls = (req, res) => {
  const allUrls = getAllUrls();
  res.json(allUrls);
}

module.exports = {
  generateShortUrl,
  getShortUrl,
  getAllShortUrls,
};
