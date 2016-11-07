require('../db')

// var Package = require('../model/package')
// Package.find({downloadUpdatedAt: {$lt: new Date(new Date().getTime() - 60 * 60 * 1000)}}).limit(5).then((res)=> {
//   console.log(res)
// }).catch((err)=>{
//   console.log(err)
// })

var downloadConsumer = require('./download/consumer')

var downloadConsumerTimer = setInterval(downloadConsumer, 500)

