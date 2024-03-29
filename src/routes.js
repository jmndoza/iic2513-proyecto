const KoaRouter = require('koa-router');
const index = require('./routes/index');
const universities = require('./routes/universities');
const users = require('./routes/users');
const evaluations = require('./routes/evaluations');
const courses = require('./routes/courses');
const sessions = require('./routes/sessions');
const dashboard = require('./routes/dashboard');
const api = require('./routes/api');
const apiApplication = require('./routes/ApiApplication');

const router = new KoaRouter();

router.use('/api', api.routes());
router.use('/api-application', apiApplication.routes());

router.use(async (ctx, next) => {
  const sessionRoutes = ['users.home', 'users.profile', 'evaluations.new', 'sessions.destroy'];
  const currentUser = ctx.session.sessionId && await ctx.orm.User.findOne(
    { where: { sessionId: ctx.session.sessionId } },
  );
  // eslint-disable-next-line no-underscore-dangle
  if (!currentUser && sessionRoutes.includes(ctx._matchedRouteName)) {
    return ctx.redirect('/');
  }
  Object.assign(ctx.state, {
    currentUser,
    newSessionPath: ctx.router.url('sessions.new'),
    destroySessionPath: ctx.router.url('sessions.destroy'),
    newUserPath: ctx.router.url('users.new'),
    editUserPath: (user) => ctx.router.url('users.edit', { id: user.id }),
    profileUserPath: (user) => ctx.router.url('users.profile', { id: user.id }),
  });
  return next();
});

router.use('/', index.routes());
router.use('/universities', universities.routes());
router.use('/users', users.routes());
router.use('/courses', courses.routes());
router.use('/evaluations', evaluations.routes());
router.use('/sessions', sessions.routes());
router.use('/dashboard', dashboard.routes());
module.exports = router;
