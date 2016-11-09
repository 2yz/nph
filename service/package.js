var rp = require('request-promise')
var Package = require('../model/package')
var Github = require('../model/github')

const GithubUtil = require('../util/github')
const TravisUtil = require('../util/travis')
const CoverallUtil = require('../util/coverall')

var PackageService = {
  findOne: function*(name) {
    var pack = yield Package.findOne({_id: name})
    var now = new Date()
    if (!pack || !pack.isFull || now.getTime() - pack.updatedAt.getTime() > 24 * 60 * 60 * 1000) {
      yield* PackageService.fetch(name)
      pack = yield Package.findOne({_id: name})
    }
    return pack
  },
  fetch: function*(name) {
    // var body = yield rp(`http://registry.npm.taobao.org/${name}`)
    var body = ''
    try {
      body = yield rp(`http://registry.npmjs.org/${name}`)
    } catch (err) {
      console.error('package fetch request error:', err)
      return null
    }
    var data = JSON.parse(body)
    PackageService.setData(data)
    data.isFull = true
    try {
      return yield Package.update({_id: data['_id']}, {$set: data}, {upsert: true})
    } catch (err) {
      console.error('package fetch mongodb update error:', name, data, err)
      return null
    }
  },
  setData: function (data) {
    // Github
    var repo = data.repository
    data.isGithubRepo = !!(repo && repo.type == 'git' && GithubUtil.isGithubRepo(repo.url))

    // Travis
    var travisURI = TravisUtil.parseURI(data.readme)
    if (travisURI) {
      data.useTravis = true
      data.travisURI = travisURI
    } else {
      data.useTravis = false
    }

    // Coverall
    var coverallURI = CoverallUtil.parseURI(data.readme)
    if (coverallURI) {
      data.useCoverall = true
      data.coverallURI = coverallURI
    } else {
      data.useCoverall = false
    }

    // if(data.isGithubRepo) console.log('github:', data.name)
    if (data.useTravis) console.log('travis:', data.name)
    if (data.useCoverall) console.log('coverall:', data.name)
  }

}

module.exports = PackageService