const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
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
    
  res.status(200).json({ip})
});

module.exports = router;
