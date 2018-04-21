const express = require('express');
const router = express.Router();
const processInvite = require('../utils/share').processInvite;

// process shared link
router.get('/', async (req, res, err) => {
  let inviter = { schoolnum: req.query.invite };
  await processInvite(inviter);
  return res.redirect('/');
});

module.exports = router;
