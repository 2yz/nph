module.exports = {
  parseURI: function (str) {
    var exp = /coveralls\.io\/(?:r\/)*(.*)\?|coveralls\.io\/(?:r\/)*(.*)\)|coveralls\.io\/(?:r\/)*(.*)\n/
    var arr = exp.exec(str)
    if (!arr) return null
    return arr[1] || arr[2] || arr[3]
  }
}