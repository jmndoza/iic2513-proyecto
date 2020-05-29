const KoaRouter = require('koa-router');
const utils = require('../utils');

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
  const university = ctx.orm.University.build();
  utils.loadUniversityPaths(ctx);
  await ctx.render('universities/index', {
    errors: ctx.state.flashMessage.warning,
    universitiesList,
    university,
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
    // ctx.redirect(ctx.router.url('universities.list'));
    ctx.redirect(ctx.router.url('universities.list'));
  } catch (validationError) {
    await ctx.render(ctx.router.url('universities.new'), {
      university,
      errors: ctx.errorToStringArray(validationError),
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
  const course = ctx.orm.Course.build();
  course.UniversityId = university.id;
  utils.loadCoursePaths(ctx);
  await ctx.render('universities/show', {
    course,
    university,
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
      errors: ctx.errorToStringArray(validationError),
      submitUniversityPath: ctx.router.url('universities.update', { id: university.id }),
    });
  }
});

router.del('universities.delete', '/:id', loadUniversity, async (ctx) => {
  const { university } = ctx.state;
  await university.destroy();
  // ctx.redirect(ctx.router.url('universities.list'));
  ctx.redirect('back');
});

module.exports = router;
