const Router = require('koa-router');
const test = require('../control/test')


const router = new Router()

router.get('/test',test.test)


module.exports = router