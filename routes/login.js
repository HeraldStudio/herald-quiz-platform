const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/auth').checkLogin;
const checkLoginParams = require('../utils/login').checkLoginParams;
const safeLogin = require('../utils/login').safeLogin;
// model

router.get('/', (req, res, next) => {
  if (req.session.user) {
    // check admin and normal user
    if (req.session.user.role == 'admin') {
      req.flash('success', '管理登录');
      return res.redirect('/admin');
    } else {
      req.flash('success', '登陆成功');
      return res.redirect('/user');
    }
  } else {
    return res.render('login');
  }
});

router.get('/logout', checkLogin, (req, res, next) => {
  if (req.session.user) {
    req.session.user = null;
    req.flash('success', '登出成功');
    return res.redirect('/');
  } else {
    return res.redirect('/');
  }
});

// post method
router.post('/', async (req, res, next) => {

  let user = {
    schoolnum: req.body.schoolnum,
    password: req.body.password
  }

  // try: check
  try {
    checkLoginParams(user);
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/login');
  }

  try {
    let userInfo = await safeLogin(user);
    // set user session
    req.session.user = {
      schoolnum: userInfo.schoolnum,
      role: userInfo.role
    }

    if (userInfo.user.role == 'admin') {
      req.flash('success', '管理登录');
      return res.redirect('/admin');
    } else {
      req.flash('success', '登陆成功');
      return res.redirect('/user');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/login');
  }
});

module.exports = router;
