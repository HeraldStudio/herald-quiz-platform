module.exports = {
  port: 3000,
  // session configs
  deployIndex: 'http://contest.heraldstudio.com/', // WARNING: remember add '/'
  session: {
    secret: 'OJ-platform',
    key: 'herald-studio-2018',
    maxAge: 2592000000
  },
  // platform configs
  periodUnit: 'week',
  choicesPerPeriod: 3,           // 3 choices per day per one
  questionsPerChoice: 10,     // questions per time
  maxSharedUsers: 5,          // max allowed sharing-credits
  quizTime: 300000,           // permitted quiz time (in ms) This is a fake frontend timer :)
  uploadTmpFiles: './uploads',// uploads dest
  allow_other_people: false
}
