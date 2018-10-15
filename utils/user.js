module.exports = {
  /*
   *  Methods:
   *    updateUserInfo(user, newUserInfo);
   *    getUserInfo(user);
   *    getUserRank(user);
   *    getLadderList(user);
   **/
  updateUserInfo: async function updateUserInfo(user, newUserInfo) {
    const userModel = require('../database/users').userModel;
    await userModel.findOneAndUpdate(user, newUserInfo).exec();
  },
  // user object
  // { schoolnum: '213150183', password: 'xxxxx'}
  getUserInfo: async function getUserInfo(user) {
    const userModel = require('../database/users').userModel;
    let userInfo = await userModel.findOne(user).exec();
    return userInfo;
  },
  // get all registered users
  getRegisteredUsers: async function getRegisteredUser() {
    const userModel = require('../database/users').userModel;
    let usersInfo = await userModel.find({ register: true }).exec();
    return usersInfo;
  },
  // getUserRank
  getUserRank: async function getUserRank(user) {
    const userModel = require('../database/users').userModel;
    let userInfo = await module.exports.getUserInfo(user);
    let higherThenUser = await userModel.count({credits: {$gt: userInfo.credits}}).exec();
    let allUsers = await userModel.count().exec();
    return (((higherThenUser+1)/(allUsers+1))*100).toFixed(1);
  },
  // get ladder ladder
  getLadderList: async function getLadderList(n) {
    const userModel = require('../database/users').userModel;
    let ladderList = await userModel.find({ register: true }).sort({ credits: -1 }).limit(n).exec();
    return ladderList;
  },
  // add users
  uploadUsers: async function uploadUsers(uploadCSV) {
    const fs = require('fs');
    const csvParser = require('csv-parse');
    const transform = require('stream-transform');
    const userModel = require('../database/users').userModel;
    // input file stream
    const input = fs.createReadStream(uploadCSV.path);
    // parser combinator
    const parser = csvParser({ delimiter: ',' });
    // transformer pipe
    const transformer = transform((record, callback) => {
      // to limit the resources
      setTimeout(async () => {
        // compose the questions
        let userItem = {
          schoolnum: record[1],
          name: record[2],
          branch: record[7],
          committee: record[8],
          register: false
        }
        await userModel.create(userItem);
      }, 50);
    }, {parallel: 10000});
    input.pipe(parser).pipe(transformer);
  }
}
