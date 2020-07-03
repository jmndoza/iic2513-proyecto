const KoaRouter = require('koa-router');
const crypto = require('crypto');
const utils = require('../utils');
const router = new KoaRouter();

router.get('sessions.new', '/new', async (ctx) => {
  const photos = await utils.loadPhoto(ctx);
  const img = photos.data.results[Math.floor(Math.random() * photos.data.results.length)];
  return ctx.render('sessions/new', {
    createSessionPath: ctx.router.url('sessions.create'),
    universitiesPath: ctx.router.url('universities.list'),
    loginPhoto: img.urls.full,
    notice: ctx.flashMessage.notice,
  });
});

router.put('sessions.create', '/', async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await ctx.orm.User.findOne({ where: { email } });
  const isPasswordCorrect = user && await user.checkPassword(password);
  if (isPasswordCorrect) {
    const sessionId = crypto.randomBytes(30).toString('base64');
    user.sessionId = sessionId;
    await user.save();
    ctx.session.sessionId = sessionId;
    return ctx.redirect('/');
  }
  return ctx.render('sessions/new', {
    createSessionPath: ctx.router.url('sessions.create'),
    universitiesPath: ctx.router.url('universities.list'),
    notice: ctx.flashMessage.notice,
    errors: ctx.errorToStringArray('Incorrect email or password'),
  });
});

router.get('sessions.destroy', '/logout', async (ctx) => {
  const { currentUser } = ctx.state;
  ctx.session.sessionId = null;
  currentUser.sessionId = null;
  await currentUser.save();
  ctx.redirect('/');
});

module.exports = router;
