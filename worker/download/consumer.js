const co = require('co')
const rp = require('request-promise')
const redisCo = require('../../service/redisCo')
const redisConst = require('../../const/redis')
const time = require('../../util/time')

var DownloadService = require('../../service/download')

var lock = false

module.exports = function () {
  co(function*() {
    if (lock) {
      // console.error(new Date(), 'download consumer lock', lock)
      return
    }
    lock = true
    var name = yield redisCo.lpop(redisConst.DownloadQueue)
    console.log(new Date(), 'download consumer start:', name)
    yield* DownloadService.fetch(name)
    console.log(new Date(), 'download consumer finish:', name)
    lock = false
  }).catch((err)=> {
    console.error(new Date(), 'download consumer error:', err)
    lock = false
  })
}