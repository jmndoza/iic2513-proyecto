// eslint-disable no-unused-vars
const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function auth(ctx, next) {
  if (!ctx.header.accesstoken) {
    ctx.body = { error: 'accessToken needed' };
    ctx.status = 401;
    return;
  }
  ctx.state.currentUser = await ctx.orm.User.findOne(
    { where: { accessToken: ctx.header.accesstoken } },
  );
  if (!ctx.state.currentUser) {
    ctx.body = { error: 'Invalid accessToken' };
    ctx.status = 401;
    return;
  }
  await next();
}

async function loadEvaluation(ctx, next) {
  ctx.state.evaluation = await ctx.orm.Evaluation.findByPk(
    ctx.params.id,
    { include: { all: true } },
  );
  if (!ctx.state.evaluation) {
    ctx.body = { error: 'Invalid id' };
    ctx.status = 404;
    return;
  }
  await next();
}

router.get('api.evaluations.list', '/', async (ctx) => {
  let evaluationsList;
  if (ctx.query.CourseId) {
    const course = await ctx.orm.Course.findByPk(ctx.query.CourseId);
    if (!course) {
      ctx.status = 404;
      ctx.body = { error: 'Invalid CourseId' };
      return;
    }
    evaluationsList = await course.getEvaluations({
      include: [
        { model: ctx.orm.Course },
        { model: ctx.orm.ProfessorName },
      ],
    });
  } else {
    evaluationsList = await ctx.orm.Evaluation.findAll({
      include: [
        { model: ctx.orm.Course },
        { model: ctx.orm.ProfessorName },
      ],
    });
  }
  ctx.body = ctx.jsonSerializer('evaluation', {
    pluralizeType: false,
    attributes: [
      'comment',
      'year',
      'semester',
      'timeRating',
      'difficultyRating',
      'response',
      'ProfessorName',
    ],
    topLevelLinks: {
      self: ctx.router.url('api.evaluations.list'),
    },
    dataLinks: {
      self: (dataset, evaluation) => ctx.router.url('api.evaluations.show', { id: evaluation.id }),
    },
  }).serialize(evaluationsList);
});

router.get('api.evaluations.show', '/:id', loadEvaluation, async (ctx) => {
  const { evaluation } = ctx.state;

  ctx.body = ctx.jsonSerializer('evaluation', {
    pluralizeType: false,
    attributes: ['comment', 'year', 'semester', 'timeRating', 'difficultyRating', 'response', 'ProfessorName'],
    topLevelLinks: {
      self: ctx.router.url('api.evaluations.show', { id: evaluation.id }),
    },
  }).serialize(evaluation);
});

router.post('api.evaluations.create', '/', auth, async (ctx) => {
  const evaluation = ctx.orm.Evaluation.build(ctx.request.body);
  evaluation.UserId = ctx.state.currentUser.id;
  try {
    await evaluation.save({ fields: ['UserId', 'ProfessorNameId', 'CourseId', 'comment', 'year', 'semester', 'timeRating', 'difficultyRating'] });
    ctx.body = { evaluation: ctx.router.url('api.evaluations.show', { id: evaluation.id }) };
    ctx.status = 200;
    return;
  } catch (validationError) {
    ctx.body = ctx.errorToStringArray(validationError);
    ctx.status = 400;
  }
});

router.patch('api.evaluations.update', '/:id', auth, loadEvaluation, async (ctx) => {
  const { evaluation } = ctx.state;

  if (ctx.state.currentUser.role !== 'admin' && ctx.state.currentUser.id !== evaluation.UserId) {
    ctx.body = { error: 'No permission' };
    ctx.status = 403;
    return;
  }

  try {
    await evaluation.update(ctx.request.body, {
      fields: ['UserId', 'ProfessorNameId', 'CourseId', 'comment', 'year', 'semester', 'timeRating', 'difficultyRating'],
    });
    ctx.body = { evaluation: ctx.router.url('api.evaluations.show', { id: evaluation.id }) };
    ctx.status = 200;
  } catch (validationError) {
    ctx.body = ctx.errorToStringArray(validationError);
    ctx.status = 400;
  }
});

router.del('api.evaluations.delete', '/:id', auth, loadEvaluation, async (ctx) => {
  const { evaluation } = ctx.state;

  if (ctx.state.currentUser.role !== 'admin' && ctx.state.currentUser.id !== evaluation.UserId) {
    ctx.body = { error: 'No permission' };
    ctx.status = 403;
    return;
  }

  await evaluation.destroy();
  ctx.status = 200;
});

module.exports = router;
