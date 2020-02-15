const express = require('express');
const router = express.Router();

// Return as JSON
router.get('/', function(req, res, next) {
  const ip = getIP(req);
  res.status(200).json({ip})
});

const getIP = (req) => {
  let ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  try {
    ip = ip.split(',')[0]
  } catch (error) {
    console.log('ERROR: Issue splitting IP Address')
    ip = null;
  }

  return ip;
}

module.exports = router;
