const express = require('express');
const router = express.Router();
const checkAdminLogin = require('../middlewares/auth').checkAdminLogin;
const uploadQuestions = require('../utils/questions').uploadQuestions;
const uploadUsers = require('../utils/user').uploadUsers;
// csv processor
const multer = require('multer');
const uploadTmpFiles = require('../config/default').uploadTmpFiles;
const uploadDest = multer({ dest: uploadTmpFiles });
// admin index
router.get('/', checkAdminLogin, async (req, res, next) => {
  return res.render('admin');
});

// upload new questions
router.get('/question/new', async (req, res, next) => {

});

// download last week data
router.get('/users/data', async (req, res, next) => {

});

// admin/user/new
router.post('/user/new', uploadDest.single('users'), async (req, res, next) => {
  uploadCSV = req.file;
  // fix me: upload questions API
  // ctx should not be passed as args
  await uploadUsers(uploadCSV);
  res.send('success');
});

module.exports = router;
