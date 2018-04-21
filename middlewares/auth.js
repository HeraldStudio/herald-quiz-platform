module.exports = {
  // checkLogin
  checkLogin: function checkLogin (req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登录');
      return res.redirect('/login');  // return login page
    }
    next();
  },
  // checkNotLogin
  checkNotLogin: function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '您已登录，无需再次注册');
      return res.redirect('back');    // return previous page
    }
    next();
  },
  // check admin login
  checkAdminLogin: function checkAdminLogin(req, res, next) {
    if (req.session.user.role != 'admin') {
      req.flash('error', '您不是管理员，无权限操作');
      return res.redirect('/login');
    }
    next();
  }
}
