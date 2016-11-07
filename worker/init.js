const fs = require('fs')
const co = require('co')
const redisCo = require('../service/redisCo')
const redisConst = require('../const/redis')
const request = require('request')
const Writable = require('stream').Writable
const Transform = require('stream').Transform
const JSONStream = require('JSONStream')

require('../db')
var Package = require('../model/package')

class PersistStream extends Writable {
  constructor(options) {
    options = options || {}
    options.objectMode = true
    super(options)
    this.count = 0
  }

  _write(data, encoding, callback) {
    var count = this.count++
    co(function*() {
      if (typeof data == 'object' && data.name) {
        // PersistStream.stringifyObjectValue(data)
        data['_id'] = data.name
        var doc = yield Package.update({_id: data['_id']}, {$set: data}, {upsert: true, setDefaultsOnInsert: true})
        yield redisCo.rpush(redisConst.DownloadQueue, data['_id'])
        yield Package.update({_id: data['_id']}, {$set: {downloadQueuedAt: new Date()}})
        if (count % 10000 == 0) {
          console.log('count:', count)
          console.log('doc:', doc)
        }
      } else if (typeof data == 'number') {
        console.log('_updated:', data)
        yield redisCo.set(redisConst.PackageUpdatedAt, data)
      } else {
        console.log('invalid data:', data)
        throw new Error('invalid data')
      }
    }).catch((err)=> {
      console.error('data:', data)
      console.error('err:', err)
    })
    callback()
  }
}

co(function*() {
  yield redisCo.del(redisConst.DownloadQueue)
  var readStream = request('http://registry.npmjs.org/-/all')
  // var readStream = fs.createReadStream('./data/all.json', {encoding: 'utf8'})
  var parseStream = JSONStream.parse('*')
  var persistStream = new PersistStream()
  readStream
    .pipe(parseStream)
    .pipe(persistStream)
    .on('finish', ()=> {
      console.log('finish')
    })
    .on('error', (err)=> {
      console.log('err:', err)
    })
}).catch((err)=> {
  console.error('err:', err)
})
