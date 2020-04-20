const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const universities = require('./routes/universities');
const users = require('./routes/users');
const evaluations = require('./routes/evaluations');

const router = new KoaRouter();

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/universities', universities.routes());
router.use('/users', users.routes());

router.use('/evaluations', evaluations.routes());
module.exports = router;
