const KoaRouter = require('koa-router');

const router = new KoaRouter();

module.exports = router;

router.get('evaluation.list', '/', async (ctx) => {
  const { currentUser } = ctx.state;
  const evaluationList = await ctx.orm.Evaluation.findAll({
    where: { UserId: currentUser.id },
    include: [
      { model: ctx.orm.Course },
      { model: ctx.orm.ProfessorName },
    ],
  });
  await ctx.render('profile/index', {
    currentUser,
    evaluationList,
  });
});
