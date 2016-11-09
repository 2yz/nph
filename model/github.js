var mongoose = require('mongoose')
var paginate = require('mongoose-paginate')
var Schema = mongoose.Schema

var githubSchema = new Schema({
  _id: {type: String, required: true, unique: true},
  name: String,
  full_name: String,
  html_url: String,
  description: String,
  stargazers_count: Number, // star
  subscribers_count: Number, // watch
  forks_count: Number // fork
})
githubSchema.plugin(paginate)

module.exports = mongoose.model('Github', githubSchema)
