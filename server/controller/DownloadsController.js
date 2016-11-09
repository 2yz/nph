const time = require('../../util/time')
const randomColor = require('randomcolor')
const PackageService = require('../../service/package')
const DownloadService = require('../../service/download')

var formatMonthResult = function (downloads) {
  var result = {labels: [], data: []}
  var data = {}
  for (var item of downloads) {
    var month = item.day.substr(0, 7)
    if (data[month]) {
      data[month] += item.downloads
    } else {
      data[month] = item.downloads
    }
  }
  for (var key in data) {
    result.labels.push(key)
    result.data.push(data[key])
  }
  return result
}

var formatResult = function (name, downloads) {
  var results = {name: name, labels: [], data: []}
  for (var item of downloads) {
    results.labels.push(item.day)
    results.data.push(item.downloads)
  }
  return results
}

module.exports = {
  all: function*() {
    this.assert(this.params.name, 400, 'require name param')
    var name = this.params.name
    var downloads = yield* DownloadService.findAll(name)
    var result = formatMonthResult(downloads)
    result.name = name
    result.color = randomColor({hue: 'red', format: 'rgba'})
    this.body = result
  },
  lastMonth: function*() {
    this.assert(this.params.name, 400, 'require name param')
    var name = this.params.name
    var range = time.getLastMonthObject()
    var downloads = yield* DownloadService.find(name, range.start, range.end)
    this.body = formatResult(name, downloads)
  },
  compare: function*() {
    var packages = this.query.q
    this.assert(Array.isArray(packages), 400, 'require multiple package')
    this.assert(packages.length <= 4, 400, 'too many packages')
    var range = time.getLastYearObject()
    var data = {}
    for (var name of packages) {
      var downloads = yield* DownloadService.find(name, range.start, range.end)
      downloads.forEach(function (down) {
        var month = down.day.substr(0, 7)
        if (!data[month]) data[month] = {}
        if (!data[month][name]) data[month][name] = 0
        data[month][name] += down.downloads
      })
    }
    var result = {labels: [], datasets: {}}
    packages.forEach((name)=> {
      result.datasets[name] = []
    })
    for (var month in data) {
      result.labels.push(month)
      packages.forEach((name)=> {
        result.datasets[name].push(data[month][name])
      })
    }
    this.body = result
  },
  compareTotal: function*() {
    var packages = this.query.q
    this.assert(Array.isArray(packages), 400, 'require multiple package')
    this.assert(packages.length <= 4, 400, 'too many packages')
    var data = []
    for (var name of packages) {
      var pack = yield* PackageService.findOne(name)
      if (pack) data.push({name: name, data: pack.downloads})
    }
    this.body = data
  }

}