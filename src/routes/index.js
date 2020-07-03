const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('/', async (ctx) => {
  // await ctx.render('index', { appVersion: pkg.version });
  ctx.redirect(ctx.router.url('universities.list'));
});

module.exports = router;
