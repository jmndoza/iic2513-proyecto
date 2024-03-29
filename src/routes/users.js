/* eslint-disable object-curly-newline */
const KoaRouter = require('koa-router');
const utils = require('../utils');
const policies = require('../policies');
const fileStorage = require('../services/file-storage');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.User.findByPk(ctx.params.id);
  return next();
}

function isMine(eva, ctx) {
  if (eva.UserId === ctx.state.currentUser.id) {
    return true;
  }
  return false;
}

async function pass(ctx, next) {
  let role = 'anonimo';
  if (ctx.state.currentUser) {
    role = ctx.state.currentUser.role;
  }
  const isAllow = policies.isAllow(role, 'Course', ctx.request.method);
  if (isAllow) {
    ctx.state.allowedCourse = policies.getPermissions(role, 'Course');
    ctx.state.allowedEvaluation = policies.getPermissions(role, 'Evaluation');
    await next();
  } else {
    ctx.status = 401;
  }
}

router.get('users.home', '/home', pass, async (ctx) => {
  const { currentUser } = ctx.state;
  const { allowedEvaluation } = ctx.state;
  if (currentUser.role === 'student') {
    const evaluationList = await currentUser.getEvaluations({
      include: [
        { model: ctx.orm.Course },
        { model: ctx.orm.ProfessorName },
      ],
    });
    utils.loadEvaluationPaths(ctx);
    await ctx.render('users/home-student', {
      evaluationList,
      allowedEvaluation,
      isMine: (eva) => isMine(eva, ctx),
    });
  } else if (currentUser.role === 'professor') {
    const coursesList = await currentUser.getCourses();
    utils.loadCoursePaths(ctx);
    await ctx.render('users/home-professor', {
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

router.get('users.profile', '/profile', pass, loadUser, async (ctx) => {
  const { allowedEvaluation } = ctx.state;
  const { currentUser } = ctx.state;
  let evaluationList = [];
  ctx.cookies.set('redirectUrl', ctx.request.url);

  if (currentUser.role === 'student') {
    evaluationList = await currentUser.getEvaluations({
      include: [
        { model: ctx.orm.Course },
        { model: ctx.orm.ProfessorName },
      ],
      order: [['createdAt', 'DESC']],
    });
  }
  utils.loadEvaluationPaths(ctx);
  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      ctx.body = { currentUser, evaluationList };
      break;
    case 'html':
      await ctx.render('users/profile', {
        allowedEvaluation,
        evaluationList,
        currentUser,
        isMine: (eva) => isMine(eva, ctx),
        editUserPath: (u) => ctx.router.url('users.edit', { id: u.id }),
      });
      break;
    default:
      break;
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

router.get('users.new', '/new/', async (ctx) => {
  const user = ctx.orm.User.build();
  await ctx.render('users/new', {
    user,
    submitUserPath: ctx.router.url('users.create'),
  });
});

router.post('users.create', '/', async (ctx) => {
  const { photo } = ctx.request.files;
  if (photo.size !== 0) {
    await fileStorage.uploadStorage('netz-bucket', photo.path, ctx.request.body.email)
      .then((file) => {
        ctx.state.urlFile = file.mediaLink;
      });
    ctx.request.body.img = ctx.state.urlFile;
  } else {
    ctx.request.body.img = null;
  }
  const user = ctx.orm.User.build(ctx.request.body);
  user.emailVerified = true;
  user.blocked = false;
  user.verified = true;
  try {
    await user.save({ fields: ['name', 'email', 'img', 'emailVerified', 'blocked', 'verified', 'role', 'password'] });
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
  const redirectUrl = ctx.cookies.get('redirectUrl') || '/';
  const { user } = ctx.state;
  try {
    const { role, name, email, password } = ctx.request.body;
    const { photo } = ctx.request.files;

    if (photo.size !== 0) {
      ctx.state.urlFile = (await fileStorage.uploadStorage('netz-bucket', photo.path, ctx.request.body.email)).mediaLink;
    } else {
      ctx.state.urlFile = null;
    }
    await user.update({ role, name, email, password, img: ctx.state.urlFile });
    ctx.redirect(redirectUrl);
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
  ctx.redirect('back');
});

module.exports = router;
