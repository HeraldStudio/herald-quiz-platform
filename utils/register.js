module.exports = {
  // check param
  checkRegisterParams: function checkRegisterParams(schoolnum, password, repassword) {
    if (!schoolnum) {
      throw new Error('请输入学号');
    }
    if (schoolnum.length != 6) {
      throw new Error('请输入正确的学号');
    }
    if (!password) {
      throw new Error('请输入密码');
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符');
    }
    if (password != repassword) {
      throw new Error('两次输入密码不一致');
    }
  },
  // check user has registered
  safeAddUser: async function safeAddUserUpdate(user) {
    const getUserInfo = require('./user').getUserInfo;
    const updateUserInfo = require('./user').updateUserInfo;
    const userModel = require('../database/users').userModel;
    const config    = require('../config/default');
    let userInfo = await getUserInfo({ schoolnum: user.schoolnum });
    if (userInfo && userInfo.register == true) {
      // someone who has registered
      throw new Error('该用户已被注册，请登录');
    } else if (userInfo && userInfo.register == false) {
      // someone whose data has been transfered in
      userInfo.password = user.password;
      userInfo.register = true;
      userInfo.credits = 0;
      userInfo.inviteCredits = 0;
      // update password
      await updateUserInfo({ schoolnum: user.schoolnum }, userInfo);
    } else {
      // someone whoes data hasn't been transfered in
      if (config.allow_other_people === true) {
        let initUser = {
          schoolnum: user.schoolnum,
          password: user.password,
          register: true,
          credits: 0,
          inviteCredits: 0
        }
        await userModel.create(initUser);
      } else {
        throw new Error('您没有权限注册，请联系管理员');
      }
    }
  }
}
