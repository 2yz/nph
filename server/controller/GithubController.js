const GithubService = require('../../service/github')

module.exports = {
  compareStar: function*() {
    var packages = this.query.q
    this.assert(Array.isArray(packages), 400, 'require multiple package')
    this.assert(packages.length <= 4, 400, 'too many packages')
    var data = []
    for (var name of packages) {
      var github = yield* GithubService.find(name)
      if (github) data.push({name: name, data: github.stargazers_count})
    }
    this.body = data
  }
}
