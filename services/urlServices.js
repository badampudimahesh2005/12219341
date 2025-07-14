const { urls } = require('../data/data');
global.urls = urls;
const crypto = require('crypto');

function generateCode(length = 5) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

function isValidShortcode(code) {
  return /^[a-zA-Z0-9]{3,10}$/.test(code);
}

function createShortUrl({ url, validity = 30, shortcode }) {
  const code = shortcode || generateUniqueCode();
  const now = new Date();
  const expiry = new Date(now.getTime() + validity * 60000);

  urls[code] = {
    originalUrl: url,
    createdAt: now.toISOString(),
    expiry: expiry.toISOString(),
    clicks: [],
  };

  return { code, expiry: urls[code].expiry };
}

function generateUniqueCode() {
  let code;
  do {
    code = generateCode();
  } while (urls[code]);
  return code;
}

function getShortUrlStats(code) {
  const data = urls[code];
  if (!data) return null;
  return {
    originalUrl: data.originalUrl,
    createdAt: data.createdAt,
    expiry: data.expiry,
    totalClicks: data.clicks.length,
    clickDetails: data.clicks,
  };
}

function getAllUrls() {
  return Object.keys(urls).map(code => ({
    shortcode: code,
    shortUrl: `http://localhost:3000/${code}`,
    originalUrl: urls[code].originalUrl,
    createdAt: urls[code].createdAt,
    expiry: urls[code].expiry,
    analytics: {
      totalClicks: urls[code].clicks.length,
      clicks: urls[code].clicks,
    }
  }));
}

function registerClick(code, req) {
  const data = urls[code];
  if (!data) return false;

  const now = new Date();
  if (new Date(data.expiry) < now) return 'expired';

  data.clicks.push({
    timestamp: now.toISOString(),
    referrer: req.get('Referrer') || 'direct',
    location: req.ip, 
  });

  return true;
}

module.exports = {
  createShortUrl,
  getShortUrlStats,
  getAllUrls,
  registerClick,
  isValidShortcode,
};
