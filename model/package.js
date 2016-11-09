var mongoose = require('mongoose')
var paginate = require('mongoose-paginate')
var Schema = mongoose.Schema

var packageSchema = new Schema({
  _id: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  description: String,
  // 'dist-tags': Schema.Types.Mixed,
  // maintainers: Schema.Types.Mixed,
  repository: Schema.Types.Mixed,
  // users: Schema.Types.Mixed,
  // readmeFilename: String,
  homepage: String,
  keywords: [String],
  // bugs: Schema.Types.Mixed,
  license: Schema.Types.Mixed,
  readme: String,
  // contributors: Schema.Types.Mixed,
  // time: Schema.Types.Mixed,
  // versions: Schema.Types.Mixed,
  
  isFull: {type: Boolean, default: false},

  /* Downloads */
  downloads: {type: Number, default: 0},
  downloadQueuedAt: {type: Date, default: 0},
  downloadUpdatedAt: {type: Date, default: 0},

  /* Github */
  isGithubRepo: Boolean,
  githubQueuedAt: {type: Date, default: 0},
  githubUpdatedAt: {type: Date, default: 0},
  github: {type: Schema.Types.ObjectId, ref: 'Github'},

  /* Travis */
  useTravis: Boolean,
  travisURI: String, // travis-ci/travis-ci
  travisQueuedAt: {type: Date, default: 0},
  travisUpdatedAt: {type: Date, default: 0},

  /* Coverall */
  useCoverall: Boolean,
  coverallURI: String,
  coverallQueuedAt: {type: Date, default: 0},
  coverallUpdatedAt: {type: Date, default: 0}

}, {timestamps: true})
packageSchema.plugin(paginate)

module.exports = mongoose.model('Package', packageSchema)
