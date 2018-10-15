const express = require('express');
const router = express.Router();
const parseUsers = require('../utils/download').parseUsers;

router.get('/', async (req, res, next) => {
  let result = await parseUsers();
  return res.render('index');
});

module.exports = router;
