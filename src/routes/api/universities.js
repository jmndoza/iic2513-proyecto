// eslint-disable no-unused-vars
const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.universities.list', '/', async (ctx) => {
  const universitiesList = await ctx.orm.University.findAll({ include: { all: true } });
  ctx.body = ctx.jsonSerializer('university', {
    pluralizeType: false,
    attributes: ['code', 'name', 'domain'],
    topLevelLinks: {
      self: ctx.router.url('api.universities.list'),
    },
    dataLinks: {
      self: (dataset, university) => ctx.router.url('api.universities.show', { id: university.id }),
    },
  }).serialize(universitiesList);
});

router.get('api.universities.show', '/:id', async (ctx) => {
  const university = await ctx.orm.University.findByPk(ctx.params.id, { include: { all: true } });
  console.log(university)
  ctx.body = ctx.jsonSerializer('university', {
    pluralizeType: false,
    attributes: ['code', 'name', 'domain'],
    topLevelLinks: {
      self: ctx.router.url('api.universities.show', { id: university.id }),
      courses: ctx.router.url('api.courses.list', { query: { UniversityId: university.id } }),
    },
  }).serialize(university);
});

module.exports = router;
