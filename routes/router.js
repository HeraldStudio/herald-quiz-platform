// main router
module.exports = function (app) {
  app.use('/'          , require('./index')    );      // index page
  app.use('/register'  , require('./register') );      // register page
  app.use('/login'     , require('./login')    );      // login page
  app.use('/question'  , require('./question') );      // get question
  app.use('/review'    , require('./review')   );      // review answers
  app.use('/user'      , require('./user')     );      // user page
  app.use('/admin'     , require('./admin')    );      // admin page
  app.use('/share'     , require('./share')    );      // share link
  app.use('/download'  , require('./download') );      // download page
}
