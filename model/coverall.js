var mongoose = require('mongoose')
var paginate = require('mongoose-paginate')
var Schema = mongoose.Schema

var coverallSchema = new Schema({
  _id: {type: String, required: true, unique: true},
  created_at: String,
  url: String,
  commit_message: String,
  branch: String,
  committer_name: String,
  committer_email: String,
  commit_sha: String,
  repo_name: String,
  badge_url: String,
  coverage_change: Number,
  covered_percent: Number
})
coverallSchema.plugin(paginate)

module.exports = mongoose.model('Coverall', coverallSchema)
