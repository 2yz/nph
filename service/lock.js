const redisCo = require('../service/redisCo')
const redisConst = require('../const/redis')

var Lock = {
  downloadIsLock: function*(name) {
    return yield redisCo.sismember(redisConst.DownloadLockSet, name)
  },
  downloadLock: function*(name) {
    yield redisCo.sadd(redisConst.DownloadLockSet, name)
  },
  downloadUnlock: function*(name) {
    yield redisCo.srem(redisConst.DownloadLockSet, name)
  }
}

module.exports = Lock