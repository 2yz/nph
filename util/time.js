var format = require('date-format')

var Time = {
  getDateStr: function (date) {
    return format('yyyy-MM-dd', date)
  },
  getLatestDateStr: function () {
    var now = new Date()
    now.setTime(now.getTime() + now.getTimezoneOffset() * 60 * 1000)  // 设为UTC时间
    return Time.getDateStr(now)
  },
  getAllRangeStr: function () {
    var old = '2012-01-01'
    return `${old}:${Time.getLatestDateStr()}`
  },
  getRangeFromStr: function (last) {
    var old = new Date(last)
    old.setTime(old.getTime() + 24 * 60 * 60 * 1000)
    return `${old}:${Time.getLatestDateStr()}`
  },
  getLastMonthObject: function () {
    var now = new Date()
    var old = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000)
    return {
      start: Time.getDateStr(old),
      end: Time.getDateStr(now)
    }
  }
}

module.exports = Time
