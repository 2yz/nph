var redisConfig = require('../config/redis')
var redisClient = require('redis').createClient(redisConfig);
var wrapper = require('co-redis');
var redisCo = wrapper(redisClient);

module.exports = redisCo;
