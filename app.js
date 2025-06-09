const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session")
const { ForbiddenError, ServiceError, UnknowError} = require("./utils/errors");
const { expressjwt } = require('express-jwt');
const md5 = require('md5')


// 默认读取项目根目录下的 .env 环境变量
require('dotenv').config()
// 处理异步错误
require("express-async-errors");
// 数据库连接
require('./dao/db')
// 引入路由
const adminRouter = require('./routes/admin');
const captchaRouter = require('./routes/captcha');
const bannerRouter = require('./routes/banner');
const uploadRouter = require('./routes/upload');
const blogTypeRouter = require('./routes/blogType')
const blogRouter = require('./routes/blog');
const projectRouter = require('./routes/project');
const messageRouter = require('./routes/message');
const settingRouter = require('./routes/setting');
const aboutRouter = require('./routes/about');

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 配置验证 token 接口
app.use(expressjwt({
  secret: md5(process.env.JWT_SECRET), // 我们所设置的秘钥
  algorithms: ["HS256"], // 新版本的 expressJWT 必须要求指定算法
}).unless({
  // 需要排除的 token 验证的路由
  path: [
    {"url": "/api/admin/login", methods: ["POST"]},
    {"url": "/api/captcha", methods: ["GET"]},
    {"url": "/api/banner", methods: ["GET"]},
    {"url": "/api/blogType", methods: ["GET"]},
    {"url": "/api/blog", methods: ["GET"]},
    {"url": /\/api\/blog\/\d/, methods: ["GET"]},
    {"url": "/api/project", methods: ["GET"]},
    {"url": "/api/message", methods: ["GET", "POST"]},
    {"url": "/api/comment", methods: ["GET", "POST"]},
    {"url": "/api/setting", methods: ["GET"]},
    {"url": "/api/about", methods: ["GET"]},
  ]
}));

// 使用路由中间件
app.use('/api/admin', adminRouter);
app.use('/api', captchaRouter);
app.use('/api/banner', bannerRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/blogType', blogTypeRouter);
app.use('/api/blog', blogRouter);
app.use('/api/project', projectRouter);
app.use('/api/message', messageRouter);
app.use('/api/comment', messageRouter);
app.use('/api/setting', settingRouter);
app.use('/api/about', aboutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if(err.name === "UnauthorizedError") {
    // 说明是 token 验证错误，抛出自定义错误
    res.send(new ForbiddenError("未登录或登录已经过期").toResponseJSON());
  } else if (err instanceof ServiceError) {
    res.send(err.toResponseJSON());
  } else {
    res.send(new UnknowError().toResponseJSON());
  }
});

module.exports = app;
