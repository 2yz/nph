var mongoose = require('mongoose')
var paginate = require('mongoose-paginate')
var Schema = mongoose.Schema

var githubSchema = new Schema({
  _id: {type: String, required: true, unique: true},
  travisId: String,
  state: String,
  updated: String
})
githubSchema.plugin(paginate)

module.exports = mongoose.model('Travis', githubSchema)
