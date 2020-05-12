const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadCourse(ctx, next) {
  ctx.state.course = await ctx.orm.Course.findByPk(ctx.params.id, {
    include: [
      { model: ctx.orm.Evaluation, include: [{ model: ctx.orm.ProfessorName }] },
    ],
  });
  return next();
}

async function loadRequirements(ctx, next) {
  ctx.state.professors = await ctx.orm.ProfessorName.findAll();
  ctx.state.currentUser = ctx.session.sessionId && await ctx.orm.User.findOne(
    { where: { sessionId: ctx.session.sessionId } },
  );
  return next();
}

router.get('courses.list', '/', async (ctx) => {
  const coursesList = await ctx.orm.Course.findAll();
  await ctx.render('courses/index', {
    coursesList,
    newCoursePath: ctx.router.url('courses.new'),
    showCoursePath: (course) => ctx.router.url('courses.show', { id: course.id }),
    editCoursePath: (course) => ctx.router.url('courses.edit', { id: course.id }),
    deleteCoursePath: (course) => ctx.router.url('courses.delete', { id: course.id }),
  });
});

router.get('courses.new', '/new', async (ctx) => {
  const course = ctx.orm.Course.build();
  course.UniversityId = ctx.query.UniversityId;
  await ctx.render('courses/new', {
    course,
    submitCoursePath: ctx.router.url('courses.create'),
  });
});

router.post('courses.create', '/', async (ctx) => {
  const course = ctx.orm.Course.build(ctx.request.body);
  if (!ctx.request.body.UniversityId) {
    course.UniversityId = null;
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

router.get('courses.edit', '/:id/edit', loadCourse, async (ctx) => {
  const { course } = ctx.state;
  const universities = await ctx.orm.University.findAll();
  await ctx.render('courses/edit', {
    course,
    universities,
    submitCoursePath: ctx.router.url('courses.update', { id: course.id }),
  });
});

router.get('courses.show', '/:id', loadCourse, loadRequirements, async (ctx) => {
  const { course } = ctx.state;
  const { professors } = ctx.state;
  await ctx.render('courses/show', {
    professors,
    course,
    showEvaluationPath: (evaluation_) => ctx.router.url('evaluations.show', { id: evaluation_.id }),
    editEvaluationPath: (evaluation_) => ctx.router.url('evaluations.edit', { id: evaluation_.id }),
    deleteEvaluationPath: (evaluation_) => ctx.router.url('evaluations.delete', { id: evaluation_.id }),
    newEvaluationPath: ctx.router.url('evaluations.new', { query: { CourseId: course.id } }),
  });
});

router.patch('course.update', '/:id', loadCourse, async (ctx) => {
  const { course } = ctx.state;
  const universities = await ctx.orm.University.findAll();
  try {
    const {
      UniversityId, code, name, verified, description,
    } = ctx.request.body;
    await course.update({
      UniversityId, code, name, verified, description,
    });
    ctx.redirect(ctx.router.url('courses.list'));
  } catch (validationError) {
    await ctx.render('courses/edit', {
      course,
      universities,
      errors: ctx.errorToStringArray(validationError),
      submitCoursePath: ctx.router.url('courses.update', { id: course.id }),
    });
  }
});

router.del('courses.delete', '/:id', loadCourse, async (ctx) => {
  const { course } = ctx.state;
  await course.destroy();
  ctx.redirect(ctx.router.url('courses.list'));
});


module.exports = router;
