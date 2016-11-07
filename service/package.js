var rp = require('request-promise')
var Package = require('../model/package')

var PackageService = {
  findOne: function*(name) {
    var pack = yield Package.findOne({_id: name})
    // TODO fetch again when outdated
    if (pack) return pack
    return yield* PackageService.fetch(name)
  },
  fetch: function*(name) {
    // var body = yield rp(`http://registry.npm.taobao.org/${name}`)
    var body = yield rp(`http://registry.npmjs.org/${name}`)
    var data = JSON.parse(body)
    return yield Package.findOneAndUpdate({_id: data['_id']}, {$set: data}, {upsert: true, new: true, setDefaultsOnInsert: true})
  }

}

module.exports = PackageService