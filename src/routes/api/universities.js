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

async function loadUniversity(ctx, next) {
  ctx.state.university = await ctx.orm.University.findOne({
    include: [{ all: true }],
    where: { id: ctx.params.id },
  });
  await next();
}

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
      delete: (dataset, university) => ctx.router.url('api.universities.delete', { id: university.id }),
    },
  }).serialize(universitiesList);
});

router.get('api.universities.show', '/:id', async (ctx) => {
  const university = await ctx.orm.University.findByPk(ctx.params.id, { include: { all: true } });
  ctx.body = ctx.jsonSerializer('university', {
    pluralizeType: false,
    attributes: ['code', 'name', 'domain'],
    topLevelLinks: {
      self: ctx.router.url('api.universities.show', { id: university.id }),
      courses: ctx.router.url('api.courses.list', { query: { UniversityId: university.id } }),
    },
  }).serialize(university);
});

router.post('api.universities.create', '/', auth, async (ctx) => {
  if (ctx.state.currentUser.role !== 'admin') {
    ctx.body = { error: 'No permission' };
    ctx.status = 403;
    return;
  }
  const university = ctx.orm.University.build(ctx.request.body);
  try {
    await university.save({ fields: ['code', 'name', 'domain'] });
    ctx.body = { university: ctx.router.url('api.universities.show', { id: university.id }) };
    ctx.status = 200;
  } catch (validationError) {
    ctx.body = ctx.errorToStringArray(validationError);
    ctx.status = 400;
  }
});

router.delete('api.universities.delete', '/:id', auth, loadUniversity, async (ctx) => {
  if (ctx.state.currentUser.role !== 'admin') {
    ctx.body = { error: 'No permission' };
    ctx.status = 403;
    return;
  }

  const { university } = ctx.state;
  if (!university) {
    ctx.body = { error: 'Invalid id' };
    ctx.status = 400;
    return;
  }

  await university.destroy();
  ctx.status = 200;
});

module.exports = router;