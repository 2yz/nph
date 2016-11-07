var router = require('koa-router')()

router.get('/', function*(next) {
  yield this.render('index', {
    title: 'Hello World Koa!'
  });
});

router.get('package/:name', require('../controller/PackageController').name)

module.exports = router;
