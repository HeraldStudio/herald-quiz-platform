const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/twoLearnOneAction');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', (callback) => {
  console.log('connection success');
});

// construct schema
const classSchema = new mongoose.Schema({
  q: {type: String, unique: true},  // question
  a: {type: String},  // choice A
  b: {type: String},  // choice B
  c: {type: String},  // choice C
  d: {type: String},  // choice D
  t: {type: String}   // true answer
}, { autoIndex: true });

const questionModel = mongoose.model('question', classSchema);

module.exports = questionModel;
