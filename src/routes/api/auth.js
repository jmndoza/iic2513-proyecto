const KoaRouter = require('koa-router');
const crypto = require('crypto');

const router = new KoaRouter();

router.post('api.auth', '/', async (ctx) => {
  ctx.type = 'application/json';
  const { email, password } = ctx.request.body;

  if (!email || !password) {
    ctx.status = 400;
    ctx.body = { error: 'Missing email or password' };
    return;
  }

  const user = await ctx.orm.User.findOne({ where: { email } });
  const isPasswordCorrect = user && await user.checkPassword(password);
  if (isPasswordCorrect) {
    const accessToken = crypto.randomBytes(30).toString('base64');
    user.accessToken = accessToken;
    await user.save();
    ctx.status = 200;
    ctx.body = { accessToken };
    return;
  }
  ctx.status = 401;
  ctx.body = { error: 'Incorrect email or password' };
});

module.exports = router;
