// eslint-disable no-unused-vars
const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.evaluations.list', '/', async (ctx) => {
  let evaluationsList;
  if (ctx.query.CourseId) {
    let course = await ctx.orm.Course.findByPk(ctx.query.CourseId);
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

router.get('api.evaluations.show', '/:id', async (ctx) => {
  const evaluation = await ctx.orm.Evaluation.findByPk(ctx.params.id, {
      include: [
        { model: ctx.orm.Course },
        { model: ctx.orm.ProfessorName },
      ],
    });
  ctx.body = ctx.jsonSerializer('evaluation', {
    pluralizeType: false,
    attributes: ['comment', 'year', 'semester', 'timeRating', 'difficultyRating', 'response', 'ProfessorName'],
    topLevelLinks: {
      self: ctx.router.url('api.evaluations.show', { id: evaluation.id }),
    },
  }).serialize(evaluation);
});

module.exports = router;
