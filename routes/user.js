const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/auth').checkLogin;
const getUserInfo = require('../utils/user').getUserInfo;
const getUserRank = require('../utils/user').getUserRank;
const getLadderList = require('../utils/user').getLadderList;
const genQRCode = require('../utils/share').genQRCode;

// user index
router.get('/', checkLogin, async (req, res, err) => {
  let user = req.session.user;
  let userInfo = { userInfo: await getUserInfo(user),
    rank: await getUserRank(user) };
  return res.render('user', userInfo);
});

// history answers records
router.get('/history', checkLogin, async (req, res, err) => {
  let user = req.session.user;
  let userInfo = { userInfo: await getUserInfo(user)}
  return res.render('history', userInfo);
});

// get ladder list
router.get('/ladder', checkLogin, async (req, res, err) => {
  let ladderList = { ladderList: await getLadderList(20) };
  return res.render('ladder', ladderList);
});

// get share link or qrcode
router.get('/share', checkLogin, async (req, res, err) => {
  let user = req.session.user;
  let qrCode = { qrcode: await genQRCode(user) };
  return res.render('share', qrCode);
});

module.exports = router;
