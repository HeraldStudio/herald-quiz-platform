const getRegisteredUsers = require('./user').getRegisteredUsers;

module.exports = {
  parseUsers: async function parseUsers() {
    let users = await getRegisteredUsers();
    if (users.length > 0) {
      let xl = require('excel4node');
      let wb = new xl.Workbook();
      let ws = wb.addWorksheet('sheet');
      // Create a reusable style
      let style = wb.createStyle({
        font: {
          color: '#FF0800',
          size: 12
        },
      });
      ws.cell(1, 1).string('学号').style(style);
      ws.cell(1, 2).string('姓名').style(style);
      ws.cell(1, 3).string('总分').style(style);
      ws.cell(1, 4).string('答题总分').style(style);
      ws.cell(1, 5).string('邀请总分').style(style);
      for (let i = 0; i < users.length; i ++) {
        console.log(users[i]);
        ws.cell(i+2,1).number(users[i].schoolnum).style(style);
        ws.cell(i+2,2).string(users[i].name).style(style);
        ws.cell(i+2,3).number(users[i].credits).style(style);
        ws.cell(i+2,4).number(users[i].credits).style(style);
        ws.cell(i+2,5).number(users[i].inviteCredits).style(style);
      }
      wb.write('test.xlsx');
      return true;
    } else return false;
  }
}
