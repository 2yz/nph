const marked = require('marked')
const numeral = require('numeral')
const randomColor = require('randomcolor')
const PackageService = require('../../service/package')
const DownloadService = require('../../service/download')
const GithubService = require('../../service/github')
const TravisService = require('../../service/travis')
const time = require('../../util/time')

module.exports = {
  name: function*() {
    this.assert(this.params.name, 400, 'require name param')
    var name = this.params.name
    var range = time.getLastMonthObject()
    // TODO check whether download isUpdated/exist while find package
    // var down = yield* DownloadService.find(name, range.start, range.end)
    var pack = yield* PackageService.findOne(name)
    var github = null
    if (pack.isGithubRepo) {
      github = yield* GithubService.find(name)
    }
    var travis = null
    if (pack.useTravis) {
      travis = yield* TravisService.find(name)
    }
    yield this.render('package/name', {
      id: pack._id, name: pack.name, description: pack.description, readme: pack.readme ? marked(pack.readme) : '',
      downloads: pack.downloads, github: github, numeral: numeral, travis: travis
    })
  },
  compare: function*() {
    var packages = this.query.q
    this.assert(Array.isArray(packages), 400, 'require multiple package')
    this.assert(packages.length <= 4, 400, 'too many packages')
    var results = []
    var ids = []
    var colors = {}
    for (var name of packages) {
      var res = yield PackageService.findOne(name)
      if (!res) continue
      results.push(res)
      ids.push(res._id)
      colors[res._id] = randomColor({luminosity: 'light', format: 'rgba'})
    }
    yield this.render('package/compare', {
      title: `Compare: ${ids.join(', ')}`, ids: JSON.stringify(ids), colors: JSON.stringify(colors)
    })
  },
  test: function*() {
    this.assert(this.params.name, 400, 'require name param')
    var name = this.params.name
    var pack = yield* PackageService.findOne(name)
    var range = time.getLastMonthObject()
    var down = yield* DownloadService.find(name, range.start, range.end)
    var github = null
    if (pack.isGithubRepo) {
      github = yield* GithubService.find(name)
    }
    var travis = null
    if (pack.useTravis) {
      travis = yield* TravisService.find(name)
    }
    this.body = {
      pack: pack, down: down, github: github, travis: travis
    }
  }
}