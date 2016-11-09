const rp = require('request-promise')
const redisCo = require('../service/redisCo')
const redisConst = require('../const/redis')

const time = require('../util/time')
const Lock = require('./lock')
const Package = require('../model/package')
const Download = require('../model/download')


var DownloadService = {
  findAll: function*(name) {
    return yield* DownloadService.find(name, '2012-01-01', time.getDateStr(new Date()))
  },
  find: function*(name, start, end) {
    var pack = yield Package.findOne({_id: name})
    if (!pack) throw new Error('no pack')
    var now = new Date()
    var delta = now.getTime() - pack.downloadUpdatedAt.getTime()
    if (delta > 24 * 60 * 60 * 1000) {
      console.log('fetch')
      yield* DownloadService.fetch(name)
    }
    return yield Download.find({'package': name, $and: [{day: {$gte: start}}, {day: {$lte: end}}]}).sort({day: 1})
  },
  fetch: function*(name) {
    try {
      var lock = yield* Lock.downloadIsLock(name)
      if (lock) return
      yield* Lock.downloadLock(name)
      var pack = yield Package.findOne({_id: name})
      if (!pack) throw new Error('no pack')
      var downs = yield Download.find({'package': name}).sort({day: -1}).limit(1)
      var url
      if (downs.length == 0) {
        url = `https://api.npmjs.org/downloads/range/${time.getAllRangeStr()}/${name}`
      } else {
        url = `https://api.npmjs.org/downloads/range/${time.getRangeFromStr(downs[0].day)}/${name}`
      }
      console.log('download url:', url)
      var body = yield rp(url)
      var result = JSON.parse(body)
      if (!result.downloads || !Array.isArray(result.downloads) || result.downloads.length == 0) {
        console.error('### invalid ###', 'name:', name, result)
      } else {
        var query = result.downloads
        for (var item of query) {
          item.package = name
        }
        yield Download.insertMany(query)
      }
      var downloads = yield* DownloadService.getDownloads(name)
      console.log('downloads:', downloads)
      yield Package.update({_id: name}, {$set: {downloads: downloads, downloadUpdatedAt: new Date()}})
      yield* Lock.downloadUnlock(name)
    } catch (err) {
      console.error(new Date(), 'DownloadService fetch error:', err)
      yield* Lock.downloadUnlock(name)
    }
  },
  getDownloads: function*(name) {
    var downloads = yield Download.find({'package': name})
    var count = 0
    for (var item of downloads) {
      count += item.downloads
    }
    console.log('count', count)
    return count
  }
}

module.exports = DownloadService