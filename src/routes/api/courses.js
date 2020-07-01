const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.courses.list', '/', async (ctx) => {
  let coursesList;
  if (ctx.query.UniversityId) {
    let university = await ctx.orm.University.findByPk(ctx.query.UniversityId);
    coursesList = await university.getCourses();
  } else {
    coursesList = await ctx.orm.Course.findAll();
  }
  ctx.body = ctx.jsonSerializer('course', {
    pluralizeType: false,
    attributes: [ 'code', 'name'],
    topLevelLinks: {
      self: ctx.router.url('api.courses.list'),
    },
    dataLinks: {
      self : (dataset, course) => ctx.router.url('api.courses.show', { id: course.id }),
    }
  }).serialize(coursesList);
});

router.get('api.courses.show', '/:id', async (ctx) => {
  console.log(ctx.params);
  const course = await ctx.orm.Course.findByPk(ctx.params.id);

  ctx.body = ctx.jsonSerializer('course', {
    pluralizeType: false,
    attributes: [ 'code', 'name'],
    topLevelLinks: {
      self: ctx.router.url('api.courses.show', { id: course.id }),
      evaluations: ctx.router.url('api.evaluations.list', { query: {CourseId: course.id } }),
    },
  }).serialize(course);
});

module.exports = router;
