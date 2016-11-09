const rp = require('request-promise')

const Package = require('../model/package')
const Github = require('../model/github')
const PackageService = require('../service/package')
const GithubUtil = require('../util/github')

var GithubService = {
  find: function*(name) {
    var github = yield Github.findOne({_id: name})
    // TODO update github result
    if (!github) {
      yield* GithubService.fetch(name)
      github = yield Github.findOne({_id: name})
    }
    return github
  },
  fetch: function*(name) {
    var pack = yield Package.findOne({_id: name})
    // TODO optimize
    if (!pack) {
      console.error('no pack', name)
      return
    }
    if (!pack.isFull) {
      pack = yield* PackageService.fetch(name)
    }
    if (!pack || !pack.isGithubRepo) {
      console.error('not github repo', name)
      return
    }
    var res = GithubUtil.parse(pack.repository.url)
    if (!res.owner || !res.repo) throw new Error('parse error')
    var body = yield rp({
      uri: `https://api.github.com/repos/${res.owner}/${res.repo}`,
      headers: {'User-Agent': 'Request-Promise'}
    })
    var data = JSON.parse(body)
    yield Github.update({_id: name}, {$set: data}, {upsert: true})
    yield Package.update({_id: name}, {$set: {githubUpdatedAt: new Date()}})
  }
}

module.exports = GithubService