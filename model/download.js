var mongoose = require('mongoose')
var paginate = require('mongoose-paginate')
var Schema = mongoose.Schema

var downloadSchema = new Schema({
  'package': {type: String},
  day: {type: String},
  downloads: {type: String}
})
downloadSchema.plugin(paginate)

module.exports = mongoose.model('Download', downloadSchema)
