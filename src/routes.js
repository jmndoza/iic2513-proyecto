const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const universities = require('./routes/universities');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/universities', universities.routes());

module.exports = router;
