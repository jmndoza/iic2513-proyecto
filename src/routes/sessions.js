const KoaRouter = require('koa-router');
const crypto = require('crypto');

const router = new KoaRouter();

router.get('sessions.new', '/new', (ctx) => ctx.render('sessions/new', {
  createSessionPath: ctx.router.url('sessions.create'),
  notice: ctx.flashMessage.notice,
}));

router.put('sessions.create', '/', async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.User.findOne({ where: { email } });
  const isPasswordCorrect = user && await user.checkPassword(password);
  if (isPasswordCorrect) {
    const sessionId = crypto.randomBytes(30).toString('base64');
    user.sessionId = sessionId;
    await user.save();
    ctx.session.sessionId = sessionId;
    ctx.redirect(ctx.router.url('courses.list'));
  }
  ctx.render('sessions/new', {
    email,
    createSessionPath: ctx.router.url('sessions.create'),
    error: 'Incorrect mail or password',
  });
});

router.delete('sessions.destroy', '/', async (ctx) => {
  ctx.session = null;
  const { currentUser } = ctx.state;
  currentUser.sessionId = null;
  await currentUser.save();
  ctx.redirect(ctx.router.url('sessions.new'));
});

module.exports = router;
