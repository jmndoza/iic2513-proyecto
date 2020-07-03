const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  ctx.redirect(ctx.router.url('universities.list'));
});

module.exports = router;
