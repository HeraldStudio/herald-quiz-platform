module.exports = {
  // generate QR Code
  genQRCode: async function genQRCode(user) {
    const deployIndex = require('../config/default').deployIndex;
    let qrCode = require('qrcode');
    // share link
    let url = deployIndex + 'share?invite=' + user.schoolnum;
    let res = {
      qrcode: await qrCode.toDataURL(url),
      url: url
    }
    return res;
  },
  // process inviting
  processInvite: async function processInvite(user) {
    const getUserInfo = require('./user').getUserInfo;
    const updateUserInfo = require('./user').updateUserInfo;
    const maxSharedUsers = require('../config/default').maxSharedUsers;
    const xDate = require('xdate');
    let userInfo = await getUserInfo(user);
    let inviteItem = {
      date: {
        y: (new xDate(xDate.now()).getFullYear()).toString(),
        w: (new xDate(xDate.now()).getWeek()).toString(),
      }
    }

    // FIXME: too much loop! use subdoc!
    let inviteCreditsOfThisWeek = 0;

    for (let info of userInfo.hasInvited) {
      if (info.w == inviteItem.w) {
        inviteCreditsOfThisWeek ++;
      }
    }

    if (inviteCreditsOfThisWeek < maxSharedUsers) {
      userInfo.credits ++;
      userInfo.inviteCredits ++;
      userInfo.hasInvited.push(inviteItem);
    }

    await updateUserInfo(user, userInfo);

  }
}
