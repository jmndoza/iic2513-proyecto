/* eslint-disable object-curly-newline */
const KoaRouter = require('koa-router');
const utils = require('../utils');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.User.findByPk(ctx.params.id);
  return next();
}

router.get('users.home', '/home', async (ctx) => {
  const { currentUser } = ctx.state;
  if (currentUser.role === 'student') {
    const evaluationList = await currentUser.getEvaluations({
      include: [
        { model: ctx.orm.Course },
        { model: ctx.orm.ProfessorName },
      ],
    });
    utils.loadEvaluationPaths(ctx);
    await ctx.render('users/home-student', {
      editUserPath: (user) => ctx.router.url('users.edit', { id: user.id }),
      evaluationList,
    });
  } else if (currentUser.role === 'professor') {
    const coursesList = await currentUser.getCourses();
    utils.loadCoursePaths(ctx);
    await ctx.render('users/home-professor', {
      editUserPath: (user) => ctx.router.url('users.edit', { id: user.id }),
      coursesList,
    });
  } else if (currentUser.role === 'admin') {
    const userList = await ctx.orm.User.findAll();
    utils.loadUserPaths(ctx);
    await ctx.render('users/home-admin', {
      userList,
    });
  }
});

router.get('users.list', '/', async (ctx) => {
  const userList = await ctx.orm.User.findAll();
  await ctx.render('users/index', {
    userList,
    newUserPath: ctx.router.url('users.new'),
    editUserPath: (user) => ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: (user) => ctx.router.url('users.delete', { id: user.id }),
  });
});

router.get('users.new', '/new', async (ctx) => {
  const user = ctx.orm.User.build();
  await ctx.render('users/new', {
    user,
    submitUserPath: ctx.router.url('users.create'),
  });
});

router.post('users.create', '/', async (ctx) => {
  const user = ctx.orm.User.build(ctx.request.body);
  user.emailVerified = true;
  user.blocked = false;
  user.verified = true;
  try {
    await user.save({ fields: ['name', 'email', 'emailVerified', 'blocked', 'verified', 'role', 'password'] });
    ctx.redirect(ctx.router.url('sessions.new'));
  } catch (validationError) {
    await ctx.render('users/new', {
      user,
      errors: ctx.errorToStringArray(validationError),
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});

router.get('users.edit', '/:id/edit', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/edit', {
    user,
    submitUserPath: ctx.router.url('users.update', { id: user.id }),
  });
});

router.patch('users.update', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  try {
    const { role, name, email, password } = ctx.request.body;
    await user.update({ role, name, email, password });
    ctx.redirect(ctx.router.url('users.home'));
  } catch (validationError) {
    await ctx.render('users/edit', {
      user,
      errors: ctx.errorToStringArray(validationError),
      submitUserPath: ctx.router.url('users.update', { id: user.id }),
    });
  }
});

router.del('users.delete', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await user.destroy();
  // ctx.redirect(ctx.router.url('users.list'));
  ctx.redirect('back');
});

module.exports = router;
