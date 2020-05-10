const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadUniversity(ctx, next) {
  ctx.state.university = await ctx.orm.University.findOne({
    include: [{ all: true }],
    where: { id: ctx.params.id },
  });
  return next();
}

router.get('universities.list', '/', async (ctx) => {
  const universitiesList = await ctx.orm.University.findAll({ include: [{ all: true }] });
  await ctx.render('universities/index', {
    universitiesList,
    newUniversityPath: ctx.router.url('universities.new'),
    universityPath: (university) => ctx.router.url('universities.show', { id: university.id }),
    editUniversityPath: (university) => ctx.router.url('universities.edit', { id: university.id }),
    deleteUniversityPath: (university) => ctx.router.url('universities.delete', { id: university.id }),
    coursePath: (course) => ctx.router.url('courses.show', { id: course.id }),
  });
});

router.get('universities.new', '/new', async (ctx) => {
  const university = ctx.orm.University.build();
  await ctx.render('universities/new', {
    university,
    submitUniversityPath: ctx.router.url('universities.create'),
  });
});

router.post('universities.create', '/', async (ctx) => {
  const university = ctx.orm.University.build(ctx.request.body);
  try {
    await university.save({ fields: ['code', 'name', 'domain'] });
    ctx.redirect(ctx.router.url('universities.list'));
  } catch (validationError) {
    await ctx.render('universities/new', {
      university,
      errors: validationError.errors,
      submitUniversityPath: ctx.router.url('universities.create'),
    });
  }
});

router.get('universities.edit', '/:id/edit', loadUniversity, async (ctx) => {
  const { university } = ctx.state;
  await ctx.render('universities/edit', {
    university,
    submitUniversityPath: ctx.router.url('universities.update', { id: university.id }),
  });
});

router.get('universities.show', '/:id', loadUniversity, async (ctx) => {
  const { university } = ctx.state;
  await ctx.render('universities/show', {
    university,
    coursePath: (course) => ctx.router.url('courses.show', { id: course.id }),
  });
});

router.patch('universities.update', '/:id', loadUniversity, async (ctx) => {
  const { university } = ctx.state;
  try {
    const { code, name, domain } = ctx.request.body;
    await university.update({ code, name, domain });
    ctx.redirect(ctx.router.url('universities.list'));
  } catch (validationError) {
    await ctx.render('universities/edit', {
      university,
      errors: validationError.errors,
      submitUniversityPath: ctx.router.url('universities.update', { id: university.id }),
    });
  }
});

router.del('universities.delete', '/:id', loadUniversity, async (ctx) => {
  const { university } = ctx.state;
  await university.destroy();
  ctx.redirect(ctx.router.url('universities.list'));
});

module.exports = router;
