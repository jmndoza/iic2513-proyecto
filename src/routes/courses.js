const KoaRouter = require('koa-router');
const utils = require('../utils');
const policies = require('../policies');

const router = new KoaRouter();

function isMine(eva, ctx) {
  if (ctx.state.currentUser) {
    if (eva.UserId === ctx.state.currentUser.id) {
      return true;
    }
  }
  return false;
}

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.User.findByPk(ctx.params.id);
  return next();
}

async function loadCourse(ctx, next) {
  ctx.state.course = await ctx.orm.Course.findByPk(ctx.params.id, {
    include: [
      { model: ctx.orm.Evaluation, include: [{ model: ctx.orm.ProfessorName }] },
    ],
  });
  return next();
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
    return next();
  }
  ctx.body = 'Uff 401';
  ctx.status = 401;
}

async function loadRequirements(ctx, next) {
  ctx.state.professors = await ctx.orm.ProfessorName.findAll();
  ctx.state.currentUser = ctx.session.sessionId && await ctx.orm.User.findOne(
    { where: { sessionId: ctx.session.sessionId } },
  );
  return next();
}

router.get('courses.list', '/', pass, async (ctx) => {
  const coursesList = await ctx.orm.Course.findAll();
  utils.loadCoursePaths(ctx);
  await ctx.render('courses/index', {
    coursesList,
  });
});

router.get('courses.new', '/new', pass, async (ctx) => {
  const course = ctx.orm.Course.build();
  course.UniversityId = ctx.query.UniversityId;
  await ctx.render('courses/new', {
    course,
    submitCoursePath: ctx.router.url('courses.create'),
  });
});

router.post('courses.create', '/', pass, async (ctx) => {
  const course = ctx.orm.Course.build(ctx.request.body);
  if (!ctx.request.body.UniversityId) {
    throw new Error('Can not create course without UniversityId');
  }
  course.verified = true;
  try {
    await course.save({ fields: ['UniversityId', 'code', 'name', 'verified', 'description'] });
    ctx.redirect(ctx.router.url('universities.show', { id: course.UniversityId }));
  } catch (validationError) {
    await ctx.render('courses/new', {
      course,
      errors: ctx.errorToStringArray(validationError),
      submitCoursePath: ctx.router.url('courses.create'),
    });
  }
});

router.get('courses.edit', '/:id/edit', pass, loadCourse, async (ctx) => {
  const { course } = ctx.state;
  const universities = await ctx.orm.University.findAll();
  await ctx.render('courses/edit', {
    course,
    universities,
    submitCoursePath: ctx.router.url('courses.update', { id: course.id }),
  });
});

router.get('courses.show', '/:id', pass, loadCourse, loadUser, loadRequirements, async (ctx) => {
  const { course } = ctx.state;
  const { professors } = ctx.state;
  const { allowedCourse } = ctx.state;
  const { allowedEvaluation } = ctx.state;

  const evaluation = ctx.orm.Evaluation.build();
  evaluation.CourseId = course.id;
  utils.loadEvaluationPaths(ctx);
  await ctx.render('courses/show', {
    professors,
    course,
    evaluation,
    allowedCourse,
    allowedEvaluation,
    isMine: (eva) => isMine(eva, ctx),
  });
});

router.patch('courses.update', '/:id', pass, loadCourse, async (ctx) => {
  const { course } = ctx.state;
  const universities = await ctx.orm.University.findAll();
  try {
    const {
      UniversityId, code, name, verified, description,
    } = ctx.request.body;
    await course.update({
      UniversityId, code, name, verified, description,
    });
    ctx.redirect(ctx.router.url('universities.show', { id: course.UniversityId }));
  } catch (validationError) {
    await ctx.render('courses/edit', {
      course,
      universities,
      errors: ctx.errorToStringArray(validationError),
      submitCoursePath: ctx.router.url('courses.update', { id: course.id }),
    });
  }
});

router.del('courses.delete', '/:id', pass, loadCourse, async (ctx) => {
  const { course } = ctx.state;
  await course.destroy();
  // ctx.redirect(ctx.router.url('universities.show', { id: course.UniversityId }));
  ctx.redirect('back');
});


module.exports = router;
