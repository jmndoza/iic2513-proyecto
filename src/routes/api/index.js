const KoaRouter = require('koa-router');
// const jwt = require('koa-jwt');

// const authApi = require('./auth');
const universitiesApi = require('./universities');
const evaluationsApi = require('./evaluations');

const router = new KoaRouter();

// unauthenticated endpoints
// router.use('/auth', authApi.routes());

// JWT authentication without passthrough (error if not authenticated)
/* router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
router.use(async (ctx, next) => {
  if (ctx.state.authData.userId) {
    ctx.state.currentUser = await ctx.orm.user.findByPk(ctx.state.authData.userId);
  }
  return next();
}); */

// authenticated endpoints
router.use('/universities', universitiesApi.routes());
router.use('/evaluations', evaluationsApi.routes());

module.exports = router;
