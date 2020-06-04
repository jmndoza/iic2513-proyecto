const KoaRouter = require('koa-router');
const utils = require('../utils');
const policies = require('../policies');

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
// eslint-disable-next-line consistent-return
async function pass(ctx, next) {
  let role = 'anonimo';
  if (ctx.state.currentUser) {
    role = ctx.state.currentUser.role;
  }
  const isAllow = policies.isAllow(role, 'Evaluation', ctx.request.method);
  if (isAllow) {
    ctx.state.allowedEvaluation = policies.getPermissions(role, 'Evaluation');
    return next();
  }

  ctx.body = 'Uff 401';
  ctx.status = 401;
}

router.get('evaluations.search', '/search', async (ctx) => {
  const { sequelize, sequelize: { QueryTypes } } = ctx.orm;
  ctx.type = 'application/json';

  ctx.body = await sequelize.query(
    `SELECT "Courses".name AS "courseName",
            "Courses".code AS "courseCode",
            "ProfessorNames".name AS "professorName",
            "Evaluations".comment,
            "Evaluations"."timeRating",
            "Evaluations"."difficultyRating",
            "Evaluations".year,
            "Evaluations".semester
    FROM "Evaluations"
    JOIN "Courses" ON "Evaluations"."CourseId" = "Courses".id
    JOIN "ProfessorNames" ON "Evaluations"."ProfessorNameId" = "ProfessorNames".id
    WHERE ("Courses".name ILIKE '%' || :course || '%' OR "Courses".code ILIKE '%' || :course || '%')
      AND "ProfessorNames".name ILIKE '%' || :professor || '%'
    LIMIT 20
    ;`,
    {
      replacements: { course: ctx.query.course || '', professor: ctx.query.professor || '' },
      type: QueryTypes.SELECT,
    },
  );
});

router.get('evaluations.list', '/', async (ctx) => {
  const evaluationsList = await ctx.orm.Evaluation.findAll({
    include: [
      { model: ctx.orm.Course },
      { model: ctx.orm.ProfessorName },
    ],
  });
  utils.loadEvaluationPaths(ctx);
  await ctx.render('evaluations/index', {
    evaluationsList,
    showCoursePath: (course) => ctx.router.url('courses.show', { id: course.id }),
  });
});

router.get('evaluations.new', '/new', loadRequirements, async (ctx) => {
  const evaluation = ctx.orm.Evaluation.build();
  evaluation.CourseId = ctx.query.CourseId;
  const { professors } = ctx.state;
  await ctx.render('evaluations/new', {
    evaluation,
    professors,
    submitEvaluationPath: ctx.router.url('evaluations.create'),
  });
});

router.post('evaluations.create', '/', loadRequirements, async (ctx) => {
  const { professors, currentUser } = ctx.state;
  const evaluation = ctx.orm.Evaluation.build(ctx.request.body);
  evaluation.UserId = currentUser.id;
  try {
    await evaluation.save({ fields: ['UserId', 'ProfessorNameId', 'CourseId', 'comment', 'year', 'semester', 'timeRating', 'difficultyRating'] });
    ctx.redirect(ctx.router.url('courses.show', { id: evaluation.CourseId }));
  } catch (validationError) {
    await ctx.render('evaluations/new', {
      evaluation,
      professors,
      errors: ctx.errorToStringArray(validationError),
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

router.get('evaluations.show', '/:id', pass, loadEvaluation, async (ctx) => {
  const { evaluation } = ctx.state;
  utils.loadEvaluationPaths(ctx);
  await ctx.render('evaluations/show', {
    evaluation,
    showCoursePath: (course) => ctx.router.url('courses.show', { id: course.id }),
  });
});

router.patch('evaluations.update', '/:id', loadEvaluation, loadRequirements, async (ctx) => {
  const redirectUrl = ctx.cookies.get('redirectUrl') || '/';
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
    ctx.redirect(redirectUrl);
  } catch (validationError) {
    await ctx.render('evaluations/edit', {
      evaluation,
      courses,
      professors,
      students,
      errors: ctx.errorToStringArray(validationError),
      submitEvaluationPath: ctx.router.url('evaluations.update', { id: evaluation.id }),
    });
  }
});

router.del('evaluations.delete', '/:id', loadEvaluation, async (ctx) => {
  const { evaluation } = ctx.state;
  await evaluation.destroy();
  // ctx.redirect(ctx.router.url('courses.show', { id: evaluation.CourseId }));
  ctx.redirect('back');
});


module.exports = router;
