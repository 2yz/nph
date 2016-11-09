require('../../db')
const co = require('co')
const Download = require('../../model/download')

co(function*() {
  var limit = 1000
  var count = yield Download.count()
  for (var offset = 0; offset <= count; offset += limit) {
    var res = yield Download.find().skip(offset).limit(limit)
    for (var down of res) {
      yield Download.update({_id: down._id}, {$set: {downloads: Number(down.downloads)}})
    }
    console.log('ok:', offset)
  }
  console.log('finish')
  process.exit()
}).catch((err)=> {
  console.error(err)
})