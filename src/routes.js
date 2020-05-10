const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const universities = require('./routes/universities');
const users = require('./routes/users');
const evaluations = require('./routes/evaluations');
const courses = require('./routes/courses');
const sessions = require('./routes/sessions');

const router = new KoaRouter();

router.use(async (ctx, next) => {
  const routesWithoutUser = ['sessions.new', 'sessions.create', 'users.new', 'users.create'];
  const currentUser = ctx.session.sessionId && await ctx.orm.User.findOne(
    { where: { sessionId: ctx.session.sessionId } },
  );
  // eslint-disable-next-line no-underscore-dangle
  if (!currentUser && !routesWithoutUser.includes(ctx._matchedRouteName)) {
    ctx.redirect(ctx.router.url('sessions.new'));
  }
  Object.assign(ctx.state, {
    currentUser,
    newSessionPath: ctx.router.url('sessions.new'),
    destroySessionPath: ctx.router.url('sessions.destroy'),
    newUserPath: ctx.router.url('users.new'),
  });
  return next();
});

router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/universities', universities.routes());
router.use('/users', users.routes());
router.use('/courses', courses.routes());
router.use('/evaluations', evaluations.routes());
router.use('/sessions', sessions.routes());

module.exports = router;
