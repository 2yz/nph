const numeral = require('numeral')
const Package = require('../../model/package')
const Github = require('../../model/github')
const PackageService = require('../../service/package')

function buildParams(arr) {
  var params = []
  arr.forEach(function (item) {
    params.push('q=' + item)
  })
  return '?' + params.join('&')
}

module.exports = {
  index: function*() {
    var str = this.query.q
    this.assert(str, 400, 'require search param')
    this.assert(!Array.isArray(str), 400, 'invalid param type')
    var data = str.match(/\S+/g) || []
    this.assert(data.length > 0, 400, 'param error')
    if (data.length == 1) {
      try {
        var pack = yield* PackageService.findOne(data[0])
        if (pack)return this.redirect(`/package/${pack._id}`)
      } catch (err) {
        console.error('search error')
      }
    } else if (data.length >= 3) {
      if (data[0] = 'compare') {
        var params = []
        for (var i = 1, l = data.length; i < l; ++i) {
          params.push(data[i])
        }
        return this.redirect(`/compare${buildParams(params)}`)
      }
    }
    var orQuery = [{_id: {$in: data}}, {keywords: {$in: data}}]
    var packs = yield Package.find({$or: orQuery}).sort({downloads: -1}).limit(10)
    var results = []
    for (var item of packs) {
      var github = yield Github.findOne({_id: item._id})
      results.push({
        'package': item,
        github: github
      })
    }
    yield this.render('search', {results: results, numeral: numeral, searchStr: str})
  }
}
