const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.evaluations.list', '/', async (ctx) => {
  const evaluationsList = await ctx.orm.Evaluation.findAll({
    include: [
      { model: ctx.orm.Course },
      { model: ctx.orm.ProfessorName },
    ],
  });
  ctx.body = ctx.jsonSerializer('evaluation', {
    attributes: ['comment', 'year', 'semester', 'timeRating', 'difficultyRating', 'response', 'CourseId', 'Course'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.evaluations.list')}`,
    },
    dataLinks: {
      self: (dataset, Evaluation) => `${ctx.origin}/api/evaluations/${Evaluation.id}`,
    },
  }).serialize(evaluationsList);
});

router.get('api.university.show', '/:id', async (ctx) => {
  const evaluation = await ctx.orm.University.findByPk(ctx.params.id);
  ctx.body = ctx.jsonSerializer('evaluation', {
    attributes: ['comment', 'year', 'semester', 'timeRating', 'difficultyRating', 'response', 'CourseId'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.university.show', { id: evaluation.id })}`,
    },
  }).serialize(evaluation);
});

module.exports = router;
