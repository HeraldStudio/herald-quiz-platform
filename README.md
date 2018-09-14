# 两学一做答题平台

> 东南大学两学一做答题活动项目，最初由祁辉完成[[liangxueyizuo](https://github.com/cherishher/liangxueyizuo)](`Tornado+MySQL`)，现在迁移到`express+mongodb`

### Features

应研究生相关方面的要求主要完成的功能有

- [x] 注册
- [x] 答题
- [x] 错题回看
- [x] 上传题目(csv格式)
- [x] 排行榜，天梯
- [x] 分享、邀请加分

#### Router

路由中间件均放到了`routes`文件夹下面，所有路由组件需要在`routes/router.js`中注册方可使用

#### Database

数据库选择了`mongodb`，并利用`mongoose`进行连接操作，所有操作均使用`async`，`await`来封装。如需新建~~数据表~~，请到`database`下新建

##### 数据库字段

```javascript
// database/users.js
const classSchema = new mongoose.Schema({
  cardnum: { type: Number, require: true, unique: true }, // 一卡通
  schoolnum: { type: Number },                            // 学号
  name: { type: String },                                 // 姓名
  password: { type: String, require: true },              // 密码
  register: { type: Boolean },                            // 是否已注册
  role: { type: String },                                 // 是否为管理员 admin | null
  branch: { type: String },                               // 党支部
  committee: { type: String },                            // 党委
  inviteCredits: { type: Number, require: true },         // 邀请加分
  hasInvited: [hasInvitedModel],                          // 邀请记录
  credits: { type: Number, require: true },               // 总积分
  hasAnswered: { type: [Number] },                        // 答题记录（暂时无用）
  history: [itemModel]                                    // 答题历史                     
});
```

```javascript
// database/questions.js
const classSchema = new mongoose.Schema({
  q: {type: String, unique: true},  // question
  a: {type: String},  // choice A
  b: {type: String},  // choice B
  c: {type: String},  // choice C
  d: {type: String},  // choice D
  t: {type: String}   // true answer
}, { autoIndex: true });
```

#### Utils

所有有关数据库的增删改查操作以及登录认定等均放到了`utils`下，这是个不太好的做法，以后会考虑修改

#### Views

所有模板均放到了`views`中，如需添加，只要按照格式添加即可。前端的`css`，`js`以及静态资源等文件均在`public`中，所有资源的路由均为`public`中子文件夹的名称，例如`public/stylesheets`的路由为`/stylesheets`

### Deploy

#### Build

```bash
$ git clone https://github.com/higuoxing/TwoLearnOneAction.git
$ cd TwoLearnOneAction
$ npm install
$ nodemon ./bin/www
```

#### Configure

```javascript
// config/default.js
module.exports = {
  port: 3000,  // 项目运行端口
  deployIndex: 'http://contest.heraldstudio.com/', // 项目部署地址，这部分会影响分享二维码的生成以及压测工具的使用
  session: {
    secret: 'OJ-platform',
    key: 'herald-studio-2018',
    maxAge: 2592000000
  },
  // platform configs
  choicesPerDay: 4,       // 每天答题次数，这里为4次
  questionsPerChoice: 20, // 每次答题数量
  maxSharedUsers: 5,      // 每周最多分享加分，如果无限制可改为9999
  quizTime: 300000        // 每次答题时间
}
```

#### Quiz

试题上传需采用 `csv` 格式，如

```csv
2015年10月18日，中共中央印发了《中国共产党廉洁自律准则》（《准则》）和《中国共产党纪律处分条例》（《条例》），《准则》的正式施行时间为____。,2015年10月18日,2016年1月1日,2016年7月1日,2015年12月1日,B
```

可自行修改 `/utils/upload.js` 解析 `csv` 的格式

#### Users

答题人员名单采用 `csv` 格式，如

```csv
学号,张三,所属党支部,所属党委
```

可自行修改 `/utils/user.js` 解析 `csv` 的格式

#### Benchmarking

> 🚧 施工中

### TODO

- [ ] 管理员模式 | Working on this ...
- [x] 集成配置文件
- [x] 分享链接
- [ ] 压测脚本
