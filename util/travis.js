module.exports = {
  parseURI: function (str) {
    if (!/travis-ci/.test(str)) return null
    var exp = /travis-ci\.org\/(.*)\.svg|travis-ci\.org\/(.*)\)|travis-ci\.org\/(.*)\n/
    var res = exp.exec(str)
    if (!res) {
      console.error(new Date(), 'travis parseURI error:', str)
      return null
    }
    return res[1] || res[2] || res[3] || res[4]
  },
  parseEntryState: function (entry) {
    try {
      var summary = entry.summary[0]['_']
      var exp = /State: *(.*)\n/
      var arr = exp.exec(summary)
      if (!arr) return null
      return arr[1]
    } catch (err) {
      console.log('parseEntryState error:', err, entry)
      return null
    }
  }

}


