module.exports = {
  /*
   * Methods:
   *   checkAnswerTimes(user);
   *   getQuestions(number);
   *   judegeAnswers(user, answers);
   *   uploadQuestions();
   **/

  // check today answer times
  checkAnswerTimes: async function checkAnswerTimes(user) {
    const userModel = require('../database/users').userModel;
    const getUserInfo = require('./user').getUserInfo;
    const periodUnit = require('../config/default').periodUnit;
    const choicesPerPeriod = require('../config/default').choicesPerPeriod;
    let userInfo = await getUserInfo({ schoolnum: user.schoolnum });

    if (periodUnit === 'day') {
      let todayAnswer = 0;
      let today = {
        y: (new Date(Date.now()).getFullYear()).toString(),
        m: (new Date(Date.now()).getMonth()+1).toString(),  // js months start from 0
        d: (new Date(Date.now()).getDate()).toString()
      }

      // fix me: have not found a proper way to use subdoc of mongoose;
      userInfo.history.forEach((item) => {
        if (item.date.y == today.y
          && item.date.m == today.m
          && item.date.d == today.d) {
          todayAnswer ++;
        }
      });

      // fix me: too much loops
      if (todayAnswer > choicesPerPeriod - 1) {
        return false;
      } else {
        return true;
      }

    } else if (periodUnit === 'week') {
      let weekAnswer = 0;
      userInfo.history.forEach((item) => {
        let now = new Date();
        let onejan = new Date(now.getFullYear(), 0, 1);
        let thisWeek = Math.ceil( (((now - onejan) / 86400000) + onejan.getDay() + 1) / 7 );

        let itemDate = new Date(parseInt(item.date.y), parseInt(item.date.m)-1, parseInt(item.date.d));
        let itemWeek = Math.ceil( (((itemDate - onejan) / 86400000) + onejan.getDay() + 1) / 7 );
        console.log("thisweek: "+thisWeek)
        console.log("itemweek: "+(itemWeek))
        if (thisWeek === itemWeek + 1)
          weekAnswer ++;
      });

      if (weekAnswer > choicesPerPeriod) {
        return false;
      } else {
        return true;
      }
    }

  },

  // get questions
  getQuestions: async function getQuestions() {
    const questionModel = require('../database/questions');
    const questionsPerChoice = require('../config/default').questionsPerChoice;
    let res = [];
    let total = await questionModel.count().exec();
    var randoms = [];    // random numbers
    i = 0;

    // generate 10 random questions
    while (randoms.length < questionsPerChoice) {
      // get a random entry
      var rand = Math.floor(Math.random() * total);
      if (randoms.indexOf(rand) > -1) continue;
      // add random to randoms
      randoms[randoms.length] = rand;
      let result = await questionModel.findOne().skip(rand).exec();
      result.i = i;
      res.push(result);
      i ++;
    }
    return res;
  },

  // judege question
  judgeAnswer: async function judgeAnswer(user, answers) {
    const questionModel = require('../database/questions');
    const userModel = require('../database/users').userModel;
    const getUserInfo = require('./user').getUserInfo;
    const updateUserInfo = require('./user').updateUserInfo;
    let credits = 0;
    let res = [];

    let newHistory = {
      questions: [],
      date: {
         y: new Date(Date.now()).getFullYear(),
         m: new Date(Date.now()).getMonth()+1,
         d: new Date(Date.now()).getDate()
      },
      credit : 0
    };

    // judge answer
		let _id = 0;
    for (let id of answers.id){
      let q = await questionModel.findOne({_id:id}).exec();
      let qa_obj = {
        // question answers object
        original: q,
        isRight: false,
        yourAns: answers[id]
      };

      if (q.t === answers[id]) {
        // answer is right
        qa_obj.isRight = true;
        credits ++;
      }
      res.push(qa_obj);
      newHistory.questions.push({
        _id: q._id,
				idx: _id,
        ans: qa_obj.yourAns,
        t: q.t
      });
			_id ++;
    }
    newHistory.credit = credits;
    // store data into user database
    // compose data
    let userInfo = await getUserInfo(user);
    // update info
    userInfo.credits += credits;
    userInfo.history.push(newHistory);
    await updateUserInfo(user, userInfo);
    return { answers: res, credit: credits };
  },

  // upload questions
  uploadQuestions: async function uploadQuestions(uploadCSV) {
    const fs = require('fs');
    const csvParser = require('csv-parse');
    const transform = require('stream-transform');
    const questionModel = require('../database/questions');
    // input file stream
    const input = fs.createReadStream(uploadCSV.path);
    // parser combinator
    const parser = csvParser({ delimiter: ',' });
    // transformer pipe
    const transformer = transform((record, callback) => {
      // to limit the resources
      setTimeout(async () => {
        // compose the questions
        let qItem = {
          q: record[0],
          a: record[1],
          b: record[2],
          c: record[3],
          d: record[4],
          t: record[5]
        };
        await questionModel.create(qItem);
      }, 500);
    });
    input.pipe(parser).pipe(transformer);
  }
}
