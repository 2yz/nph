var PackageService = require('../../service/package')
var DownloadService = require('../../service/download')

const time = require('../../util/time')

module.exports = {
  name: function*() {
    this.assert(this.params.name, 400, 'require name param')
    var name = this.params.name
    var pack = yield* PackageService.findOne(name)
    var range = time.getLastMonthObject()
    var down = yield* DownloadService.find(name, range.start, range.end)
    this.body = {
      pack: pack, down: down
    }
  }
}