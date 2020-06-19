const KoaRouter = require('koa-router');
const utils = require('../utils');
const policies = require('../policies');
const fileStorage = require('../services/file-storage');

const router = new KoaRouter();

async function loadUniversity(ctx, next) {
  ctx.state.university = await ctx.orm.University.findOne({
    include: [{ all: true }],
    where: { id: ctx.params.id },
  });
  return next();
}
// eslint-disable-next-line consistent-return
async function pass(ctx, next) {
  let role = 'anonimo';
  if (ctx.state.currentUser) {
    role = ctx.state.currentUser.role;
  }
  const isAllow = policies.isAllow(role, 'University', ctx.request.method);
  if (isAllow) {
    ctx.state.allowedCourse = policies.getPermissions(role, 'Course');
    ctx.state.allowedUniversity = policies.getPermissions(role, 'University');

    return next();
  }

  ctx.body = 'Uff 401';
  ctx.status = 401;
}

router.get('universities.list', '/', pass, async (ctx) => {
  const universitiesList = await ctx.orm.University.findAll({ include: [{ all: true }] });
  const university = ctx.orm.University.build();
  const { allowedUniversity, allowedCourse } = ctx.state;
  utils.loadUniversityPaths(ctx);
  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      ctx.body = universitiesList;
      console.log('json university');
      break;
    case 'html':
      await ctx.render('universities/index', {
        errors: ctx.state.flashMessage.warning,
        universitiesList,
        university,
        allowedUniversity,
        allowedCourse,
        coursePath: (course) => ctx.router.url('courses.show', { id: course.id }),
      });
      break;
    default:
      break;
  }
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

router.get('universities.show', '/:id', pass, loadUniversity, async (ctx) => {
  const { university } = ctx.state;
  const { allowedUniversity } = ctx.state;
  const course = ctx.orm.Course.build();
  course.UniversityId = university.id;
  utils.loadCoursePaths(ctx);

  await ctx.render('universities/show', {
    course,
    university,
    allowedUniversity,
  });
});

router.patch('universities.update', '/:id', loadUniversity, async (ctx) => {
  const { university } = ctx.state;
  try {
    const { code, name, domain } = ctx.request.body;
    const { photo } = ctx.request.files;

    if (photo.size !== 0) {
      ctx.state.urlFile = (await fileStorage.uploadStorage('netz-bucket', photo.path, ctx.request.body.code)).mediaLink;
    } else {
      ctx.state.urlFile = null;
    }
    await university.update({
      code, name, domain, img: ctx.state.urlFile,
    });
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
