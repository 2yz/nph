var router = require('koa-router')()

router.get('/', function*(next) {
  yield this.render('index')
});

router.get('package/:name', require('../controller/PackageController').name)
router.get('package/test/:name', require('../controller/PackageController').test)
router.get('compare', require('../controller/PackageController').compare)

router.get('downloads/all/:name', require('../controller/DownloadsController').all)
router.get('downloads/compare', require('../controller/DownloadsController').compare)
router.get('downloads/compare/total', require('../controller/DownloadsController').compareTotal)

router.get('github/compare/star', require('../controller/GithubController').compareStar)

router.get('search', require('../controller/SearchController').index)

module.exports = router;
