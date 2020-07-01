const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.universities.list', '/', async (ctx) => {
  const universitiesList = await ctx.orm.University.findAll({ include: [{ all: true }] });
  ctx.body = ctx.jsonSerializer('university', {
    attributes: ['code', 'name', 'domain'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.universities.list')}`,
    },
    dataLinks: {
      self: (dataset, University) => `${ctx.origin}/api/universities/${University.id}`,
    },
  }).serialize(universitiesList);
});

router.get('api.university.show', '/:id', async (ctx) => {
  const university = await ctx.orm.University.findByPk(ctx.params.id);
  ctx.body = ctx.jsonSerializer('university', {
    attributes: ['code', 'name', 'domain'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.university.show', { id: university.id })}`,
    },
  }).serialize(university);
});

module.exports = router;
