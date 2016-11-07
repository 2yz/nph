const fs = require('fs')

// Database Config
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/nph')
// load models
var modelPath = './model/'
var modelFiles = fs.readdirSync(modelPath)
modelFiles.forEach(function (file) {
  require(modelPath + file)
})