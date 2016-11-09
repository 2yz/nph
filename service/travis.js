const rp = require('request-promise')
const xml = require('../util/xml')
const TravisUtil = require('../util/travis')
const Package = require('../model/package')
const Travis = require('../model/travis')

var TravisService = {
  find: function*(name) {
    var travis = yield Travis.findOne({_id: name})
    // TODO update travis result
    if (!travis) {
      yield* TravisService.fetch(name)
      travis = yield Travis.findOne({_id: name})
    }
    return travis
  },
  fetch: function*(name) {
    var pack = yield Package.findOne({_id: name})
    if (!pack) throw new Error('no pack')
    if (!pack.useTravis || !pack.travisURI) throw new Error('no travis')
    var body = yield rp(`https://api.travis-ci.org/repos/${pack.travisURI}/builds.atom`)
    var result = yield xml.parse(body)
    if (!result || !result.feed || !Array.isArray(result.feed.entry)) {
      console.error('invalid travis result:', pack.travisURI, body)
      return
    }
    var feed = result.feed
    var query = {_id: name, travisId: feed.id[0], updated: feed.updated[0]}
    var entry = result.feed.entry
    if (entry.length > 0) {
      var state = TravisUtil.parseEntryState(entry[0])
      if (state) query.state = state
    }
    yield Travis.update({_id: name}, {$set: query}, {upsert: true})
    yield Package.update({_id: name}, {$set: {travisUpdatedAt: new Date()}})
  }
}

module.exports = TravisService 
