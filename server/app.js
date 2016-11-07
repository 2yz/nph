var fs = require('fs')
var app = require('koa')()
var error = require('koa-error')
var session = require('koa-generic-session');
var redisStore = require('koa-redis');
var redisConfig = require('../config/redis')
var koa = require('koa-router')()
var logger = require('koa-logger')
var json = require('koa-json')
var views = require('koa-views')

// Database Config
require('../db')

// development logger
if (process.env.NODE_ENV != "production") {
  app.use(logger());
}

// global middlewares
app.use(views('view', {
  root: __dirname + '/view',
  default: 'ejs'
}));
app.use(error())
app.keys = ['621e1524', '75ef4793a64009a355140806'];
app.use(session({
  key: 'ant',
  rolling: true,
  store: redisStore(redisConfig),
  cookie: {
    path: '/',
    httpOnly: true,
    maxage: 604800000, // 7 days
    rewrite: true,
    signed: true
  }
}));
app.use(require('koa-bodyparser')());
app.use(json());
app.use(require('koa-static')(__dirname + '/public'));

// routes definition
var index = require('./route/index')
koa.use('/', index.routes(), index.allowedMethods());
// mount root routes  
app.use(koa.routes());

// error handler
app.on('error', function (err, ctx) {
  if (!err.status || err.status >= 500) {
    console.error('server error:', err, ctx)
  }
});

module.exports = app;
