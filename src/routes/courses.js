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

router.get('courses.show', '/:id/show', loadCourse, async (ctx) => {
  const { course } = ctx.state;
  await ctx.render('courses/show', {
    course,
    showEvaluationPath: (evaluation) => ctx.router.url('evaluations.show', { id: evaluation.id }),
    editEvaluationPath: (evaluation) => ctx.router.url('evaluations.edit', { id: evaluation.id }),
    deleteEvaluationPath: (evaluation) => ctx.router.url('evaluations.delete', { id: evaluation.id }),
  });
});

router.get('courses.new', '/new', async (ctx) => {
  const course = ctx.orm.Course.build();
  const universities = await ctx.orm.University.findAll();
  await ctx.render('courses/new', {
    course,
    universities,
    submitCoursePath: ctx.router.url('courses.create'),
  });
});

router.post('courses.create', '/', async (ctx) => {
  const course = ctx.orm.Course.build(ctx.request.body);
  course.verified = true;
  const universities = await ctx.orm.University.findAll();
  try {
    await course.save({ fields: ['UniversityId', 'code', 'name', 'verified', 'description'] });
    ctx.redirect(ctx.router.url('courses.list'));
  } catch (validationError) {
    await ctx.render('courses/new', {
      course,
      universities,
      errors: validationError.errors,
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
      errors: validationError.errors,
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
