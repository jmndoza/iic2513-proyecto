const KoaRouter = require('koa-router');

const authApi = require('./auth');
const universitiesApi = require('./universities');
const coursesApi = require('./courses');
const evaluationsApi = require('./evaluations');

const router = new KoaRouter();

router.use('/auth', authApi.routes());
router.use('/universities', universitiesApi.routes());
router.use('/courses', coursesApi.routes());
router.use('/evaluations', evaluationsApi.routes());

module.exports = router;
