const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const {ip} = req;
  res.status(200).json({ip})
});

module.exports = router;
