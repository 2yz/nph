module.exports = {
  parse: function (url) {
    try {
      var path = url.split('github.com/')[1]
      var arr = path.split('/')
      return {owner: arr[0], repo: arr[1].split('.git')[0]}
    } catch (err) {
      return {owner: null, repo:null}
    }
  },
  isGithubRepo: function (url) {
    var str = String(url)
    return str.indexOf('github.com') >= 0
  }
}