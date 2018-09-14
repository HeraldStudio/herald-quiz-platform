const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/auth').checkLogin;
const checkAnswerTimes = require('../utils/questions').checkAnswerTimes;
const getQuestions = require('../utils/questions').getQuestions;
const judgeAnswer = require('../utils/questions').judgeAnswer;
const uploadQuestions = require('../utils/questions').uploadQuestions;
// csv processor
const multer = require('multer');
const uploadTmpFiles = require('../config/default').uploadTmpFiles;
const uploadDest = multer({ dest: uploadTmpFiles });

// GET questions. */
router.get('/rules', checkLogin, async (req, res, next) => {
  let user = req.session.user;
  let judge = await checkAnswerTimes(user);
  if (judge) {
    return res.render('rules');
  } else {
    req.flash('success', '本周期内的次数用完啦！下周再来吧');
    return res.redirect('/user');
  }
});

// get questions from database
// async function
router.get('/list', checkLogin, async (req, res, next) => {
  const quizTime = require('../config/default').quizTime;
  let questions = { questions: await getQuestions(), quizTime: quizTime };
  return res.render('question', questions);
});

// judege answers
router.post('/judge', checkLogin, async (req, res, next) => {
  let answers = req.body;
  let user = req.session.user;
  let result = { ansStruct : await judgeAnswer(user, answers)};
  return res.render('review', result);
});

// upload questions
router.post('/new', uploadDest.single('question'), async (req, res, next) => {
  uploadCSV = req.file;
  // fix me: upload questions API
  // ctx should not be passed as args
  await uploadQuestions(uploadCSV);
  res.send('success');
});

module.exports = router;
