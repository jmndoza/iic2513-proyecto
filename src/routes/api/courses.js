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

async function loadCourse(ctx, next) {
  ctx.state.course = await ctx.orm.Course.findByPk(
    ctx.params.id,
    { include: { all: true } },
  );
  if (!ctx.state.course) {
    ctx.body = { error: 'Invalid id' };
    ctx.status = 404;
    return;
  }
  await next();
}

router.get('api.courses.list', '/', async (ctx) => {
  let coursesList;
  if (ctx.query.UniversityId) {
    const university = await ctx.orm.University.findByPk(ctx.query.UniversityId);
    if (!university) {
      ctx.status = 404;
      ctx.body = { error: 'Invalid UniverityId' };
      return;
    }
    coursesList = await university.getCourses();
  } else {
    coursesList = await ctx.orm.Course.findAll();
  }
  ctx.body = ctx.jsonSerializer('course', {
    pluralizeType: false,
    attributes: ['code', 'name', 'description'],
    topLevelLinks: {
      self: ctx.router.url('api.courses.list'),
    },
    dataLinks: {
      self: (dataset, course) => ctx.router.url('api.courses.show', { id: course.id }),
    },
  }).serialize(coursesList);
});

router.get('api.courses.show', '/:id', loadCourse, async (ctx) => {
  const { course } = ctx.state;

  ctx.body = ctx.jsonSerializer('course', {
    pluralizeType: false,
    attributes: ['code', 'name', 'description'],
    topLevelLinks: {
      self: ctx.router.url('api.courses.show', { id: course.id }),
      evaluations: ctx.router.url('api.evaluations.list', { query: { CourseId: course.id } }),
    },
  }).serialize(course);
});

router.post('api.courses.create', '/', auth, async (ctx) => {
  if (ctx.state.currentUser.role !== 'admin') {
    ctx.body = { error: 'No permission' };
    ctx.status = 403;
    return;
  }
  const course = ctx.orm.Course.build(ctx.request.body);
  course.verified = true;
  try {
    await course.save({ fields: ['UniversityId', 'code', 'name', 'verified', 'description'] });
    ctx.body = { course: ctx.router.url('api.courses.show', { id: course.id }) };
    ctx.status = 200;
    return;
  } catch (validationError) {
    ctx.body = ctx.errorToStringArray(validationError);
    ctx.status = 400;
  }
});

router.patch('api.courses.update', '/:id', auth, loadCourse, async (ctx) => {
  const { course } = ctx.state;

  if (ctx.state.currentUser.role !== 'admin') {
    ctx.body = { error: 'No permission' };
    ctx.status = 403;
    return;
  }

  try {
    await course.update(ctx.request.body, {
      fields: ['UniversityId', 'code', 'name', 'verified', 'description'],
    });
    ctx.body = { evaluation: ctx.router.url('api.evaluations.show', { id: course.id }) };
    ctx.status = 200;
  } catch (validationError) {
    ctx.body = ctx.errorToStringArray(validationError);
    ctx.status = 400;
  }
});

router.del('api.courses.delete', '/:id', auth, loadCourse, async (ctx) => {
  const { course } = ctx.state;

  if (ctx.state.currentUser.role !== 'admin') {
    ctx.body = { error: 'No permission' };
    ctx.status = 403;
    return;
  }

  await course.destroy();
  ctx.status = 200;
});

module.exports = router;
