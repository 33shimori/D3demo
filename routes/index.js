var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('templates/index_displaylog', { title: 'D3 demo' });
});

module.exports = router;
