const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/twoLearnOneAction');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', (callback) => {
  console.log('connection success');
});

const itemModel = new mongoose.Schema({
  questions: [{
    _id: String,
    ans: String,
    t: String
  }],
  date: {
    y: String,
    m: String,
    d: String
  },
  credit: Number
});

const hasInvitedModel = new mongoose.Schema({
  date: {
    y: String,  // year
    w: String
  }
});

// construct schema
const classSchema = new mongoose.Schema({
  schoolnum: { type: Number, require: true, unique: true },
  name: { type: String },
  password: { type: String, require: true },           // password
  register: { type: Boolean },                         // has registered?
  role: { type: String },                              // role: admin | null
  branch: { type: String },                            // Party branch
  committee: { type: String },                         // Party committee
  inviteCredits: { type: Number, require: true },      // credits from inviting
  hasInvited: [hasInvitedModel],                       // invite log
  credits: { type: Number, require: true },            // credits that has earned
  hasAnswered: { type: [Number] },                     // question number that has answered
  // nested schema
  history: [itemModel]
});

const userModel = mongoose.model('users', classSchema);

module.exports = {
  userModel: userModel,
  itemModel: itemModel
}
