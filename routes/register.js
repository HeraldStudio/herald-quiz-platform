const express = require('express');
const router = express.Router();
const userModel = require('../database/users');
const checkNotLogin = require('../middlewares/auth').checkNotLogin;
const checkRegisterParams = require('../utils/register').checkRegisterParams;
const safeAddUser = require('../utils/register').safeAddUser;
const safeAddUserUpdate = require('../utils/register').safeAddUserUpdate;

/* GET register page. */
router.get('/', checkNotLogin, (req, res, next) => {
  try {
    if (req.session.user) {
      throw new Error('您已登录，无需再次注册');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/');
  }
  return res.render('register');
});

/* POST form to register */
router.post('/', checkNotLogin, async (req, res, next) => {
  // get post data
  const schoolnum    = req.body.schoolnum;
  const password   = req.body.password;
  const repassword = req.body.repassword;

  // try: check params
  try {
    checkRegisterParams(schoolnum, password, repassword);
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('/register');
  }

  let user = {
    schoolnum: schoolnum,
    password: password
  };

  try {
    let status = await safeAddUser(user);
    req.session.user = { schoolnum: user.schoolnum };
    req.flash('success', '注册成功');
    return res.redirect('/user');
  } catch(e) {
    req.flash('error', e.message);
    return res.redirect('register');
  }
});

module.exports = router;
