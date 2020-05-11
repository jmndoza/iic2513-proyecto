const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadEvaluation(ctx, next) {
  ctx.state.evaluation = await ctx.orm.Evaluation.findByPk(ctx.params.id, {
    include: [
      { model: ctx.orm.Course },
      { model: ctx.orm.ProfessorName },
    ],
  });
  return next();
}
async function loadRequirements(ctx, next) {
  ctx.state.courses = await ctx.orm.Course.findAll();
  ctx.state.professors = await ctx.orm.ProfessorName.findAll();
  ctx.state.students = await ctx.orm.User.findAll({
    where: {
      role: 'student',
    },
  });
  return next();
}
router.get('evaluations.list', '/', async (ctx) => {
  const evaluationsList = await ctx.orm.Evaluation.findAll({
    include: [
      { model: ctx.orm.Course },
      { model: ctx.orm.ProfessorName },
    ],
  });
  await ctx.render('evaluations/index', {
    evaluationsList,
    newEvaluationPath: ctx.router.url('evaluations.new'),
    showEvaluationPath: (evaluation) => ctx.router.url('evaluations.show', { id: evaluation.id }),
    showCoursePath: (course) => ctx.router.url('courses.show', { id: course.id }),
    editEvaluationPath: (evaluation) => ctx.router.url('evaluations.edit', { id: evaluation.id }),
    deleteEvaluationPath: (evaluation) => ctx.router.url('evaluations.delete', { id: evaluation.id }),
  });
});

router.get('evaluations.new', '/new', loadRequirements, async (ctx) => {
  const evaluation = ctx.orm.Evaluation.build();
  const { courses, professors, students } = ctx.state;
  await ctx.render('evaluations/new', {
    evaluation,
    courses,
    professors,
    students,
    submitEvaluationPath: ctx.router.url('evaluations.create'),
  });
});

router.post('evaluations.create', '/', loadRequirements, async (ctx) => {
  const {
    courses, professors, students, currentUser,
  } = ctx.state;
  ctx.request.body.UserId = currentUser.id;
  const evaluation = ctx.orm.Evaluation.build(ctx.request.body);
  try {
    await evaluation.save({ fields: ['UserId', 'ProfessorNameId', 'CourseId', 'comment', 'year', 'semester', 'timeRating', 'difficultyRating'] });
    ctx.redirect(ctx.router.url('evaluations.list'));
  } catch (validationError) {
    await ctx.render('evaluations/new', {
      evaluation,
      courses,
      professors,
      students,
      errors: validationError.errors,
      submitEvaluationPath: ctx.router.url('evaluations.create'),
    });
  }
});

router.get('evaluations.edit', '/:id/edit', loadEvaluation, loadRequirements, async (ctx) => {
  const { evaluation } = ctx.state;
  const { courses, professors, students } = ctx.state;
  await ctx.render('evaluations/edit', {
    evaluation,
    courses,
    professors,
    students,
    submitEvaluationPath: ctx.router.url('evaluations.update', { id: evaluation.id }),
  });
});

router.get('evaluations.show', '/:id', loadEvaluation, async (ctx) => {
  const { evaluation } = ctx.state;
  await ctx.render('evaluations/show', {
    evaluation,
    showEvaluationPath: (evaluation_) => ctx.router.url('evaluations.show', { id: evaluation_.id }),
    showCoursePath: (course) => ctx.router.url('courses.show', { id: course.id }),
    editEvaluationPath: (evaluation_) => ctx.router.url('evaluations.edit', { id: evaluation_.id }),
    deleteEvaluationPath: (evaluation_) => ctx.router.url('evaluations.delete', { id: evaluation_.id }),
  });
});

router.patch('evaluations.update', '/:id', loadEvaluation, loadRequirements, async (ctx) => {
  const { evaluation, currentUser } = ctx.state;
  const { courses, professors, students } = ctx.state;
  ctx.request.body.UserId = currentUser.id;
  try {
    const {
      UserId, ProfessorNameId, CourseId, comment, year, semester, timeRating, difficultyRating,
    } = ctx.request.body;
    await evaluation.update({
      UserId, ProfessorNameId, CourseId, comment, year, semester, timeRating, difficultyRating,
    });
    ctx.redirect(ctx.router.url('evaluations.list'));
  } catch (validationError) {
    await ctx.render('evaluations/edit', {
      evaluation,
      courses,
      professors,
      students,
      errors: validationError.errors,
      submitEvaluationPath: ctx.router.url('evaluations.update', { id: evaluation.id }),
    });
  }
});

router.del('evaluations.delete', '/:id', loadEvaluation, async (ctx) => {
  const { evaluation } = ctx.state;
  await evaluation.destroy();
  //ctx.redirect(ctx.router.url('evaluations.list'));
  ctx.redirect('back');
});

module.exports = router;
