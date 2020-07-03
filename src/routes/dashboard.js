const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('dashboard.home', '/', async (ctx) => {
  await ctx.render('dashboard/index', {
  });
});

router.get('dashboard.courserating', '/courserating', async (ctx) => {
  const { sequelize, sequelize: { QueryTypes } } = ctx.orm;
  ctx.type = 'application/json';
  ctx.body = await sequelize.query(
    `SELECT "Universities".name AS "universityName",
            "Courses".name AS "courseName",
            AVG("Evaluations"."timeRating") AS "avgTimeRating",
            AVG("Evaluations"."difficultyRating") AS "avgDifficultyRating"
    FROM "Universities"
    JOIN "Courses" ON "Courses"."UniversityId" = "Universities".id
    JOIN "Evaluations" ON "Evaluations"."CourseId" = "Courses".id
    GROUP BY "universityName", "courseName"
    ;`,
    {
      type: QueryTypes.SELECT,
    },
  );
});

router.get('dashboard.professorrating', '/professorrating', async (ctx) => {
  const { sequelize, sequelize: { QueryTypes } } = ctx.orm;
  ctx.type = 'application/json';
  ctx.body = await sequelize.query(
    `SELECT "ProfessorNames".name AS "profesorName",
            "Courses".name AS "coursesName",
            "Universities".name AS "universityName",
            AVG("Evaluations"."timeRating") AS "avgTimeRating",
            AVG("Evaluations"."difficultyRating") AS "avgDifficultyRating"
    FROM "ProfessorNames"
    JOIN "Evaluations" ON "Evaluations"."ProfessorNameId" = "ProfessorNames".id
    JOIN "Courses" ON "Evaluations"."CourseId" = "Courses".id
    JOIN "Universities" ON "Courses"."UniversityId" = "Universities".id
    GROUP BY "profesorName", "coursesName", "universityName"
    ;`,
    {
      type: QueryTypes.SELECT,
    },
  );
});

router.get('dashboard.activity', '/activity', async (ctx) => {
  const { sequelize, sequelize: { QueryTypes } } = ctx.orm;
  ctx.type = 'application/json';
  ctx.body = await sequelize.query(
    `SELECT CAST("Evaluations"."createdAt" AS DATE),
            COUNT("Evaluations".id) AS "quantity",
            "Universities".name AS "universityName"
      FROM "Evaluations"
      JOIN "Courses" ON "Courses".id = "Evaluations"."CourseId"
      JOIN "Universities" ON "Courses"."UniversityId" = "Universities".id
      GROUP BY CAST("Evaluations"."createdAt" AS DATE), "universityName"
    ;`,
    {
      type: QueryTypes.SELECT,
    },
  );
});

router.get('dashboard.totales', '/totals', async (ctx) => {
  const { sequelize, sequelize: { QueryTypes } } = ctx.orm;
  ctx.type = 'application/json';
  ctx.body = await sequelize.query(
    `SELECT "Universities".name AS "universityName",
            COUNT("Evaluations".id) AS "totalEvaluations"
    FROM "Universities"
    JOIN "Courses" ON "Courses"."UniversityId" = "Universities".id
    LEFT JOIN "Evaluations" ON "Evaluations"."CourseId" = "Courses".id
    GROUP BY "universityName"
    ;`,
    {
      type: QueryTypes.SELECT,
    },
  );
});

router.get('dashboard.universities', '/universities', async (ctx) => {
  const { sequelize, sequelize: { QueryTypes } } = ctx.orm;
  ctx.type = 'application/json';
  ctx.body = await sequelize.query(
    `SELECT "Universities".name AS "universityName",
            "Universities".id AS "universityId"
    FROM "Universities"
    ;`,
    {
      type: QueryTypes.SELECT,
    },
  );
});

module.exports = router;
