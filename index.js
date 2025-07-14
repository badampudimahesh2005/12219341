const express = require('express');
const cors = require('cors');
require('dotenv').config();
const shortUrlRoutes = require('./routes/shortUrlRoutes');
const { registerClick } = require('./services/urlServices');


const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Redirect route
app.get('/:code', (req, res) => {
  const result = registerClick(req.params.code, req);
  if (result === false) return res.status(404).json({ error: 'Shortcode not found' });
  if (result === 'expired') return res.status(410).json({ error: 'Shortlink expired' });

  const originalUrl = global.urls[req.params.code].originalUrl;
  res.redirect(originalUrl);
});

// API Routes
app.use('/api/shorturls', shortUrlRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});