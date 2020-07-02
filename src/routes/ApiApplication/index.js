const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('ApiApplication', '/', async (ctx) => {
  await ctx.render('ApiApplication/index', { layout: false });
});

module.exports = router;
