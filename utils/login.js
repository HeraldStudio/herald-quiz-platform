module.exports = {
  // check login parameters
  checkLoginParams: function checkLoginParams(user) {
    if (user.schoolnum.length == 0) {
      throw new Error('请输入学号');
    }
    if (user.schoolnum.length != 6) {
      throw new Error('请输入正确的学号');
    }
    if (user.password.length == 0) {
      throw new Error('请输入密码');
    }
  },
  // safe login without warrying side effects
  safeLogin: async function safeLogin(user) {
    const userModel = require('../database/users').userModel;
    let userInfo = await userModel.findOne(user).exec();
    if (userInfo) {
      return userInfo;
    } else {
      throw new Error('学号或密码不正确');
    }
  }
}
