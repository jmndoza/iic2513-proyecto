/* eslint-disable no-else-return */
/* eslint-disable func-names */
module.exports.errorToStringArray = function (error) {
  if (typeof error === 'string') {
    return [error];
  } else if (error.errors) {
    return error.errors.map((err) => err.message);
  } else if (error.message) {
    return [error.message];
  } else {
    throw error;
  }
};

module.exports.loadUserPaths = function (ctx) {
  ctx.state.showUserPath = (user) => ctx.router.url('users.show', { id: user.id });
  ctx.state.deleteUserPath = (user) => ctx.router.url('users.delete', { id: user.id });
};

module.exports.loadEvaluationPaths = function (ctx) {
  if (ctx.state.course) ctx.state.newEvaluationPath = ctx.router.url('evaluations.new', { query: { CourseId: ctx.state.course.id } });
  ctx.state.submitEvaluationPath = ctx.router.url('evaluations.create');
  ctx.state.showEvaluationPath = (evaluation_) => ctx.router.url('evaluations.show', { id: evaluation_.id });
  ctx.state.editEvaluationPath = (evaluation_) => ctx.router.url('evaluations.edit', { id: evaluation_.id });
  ctx.state.deleteEvaluationPath = (evaluation_) => ctx.router.url('evaluations.delete', { id: evaluation_.id });
};

module.exports.loadCoursePaths = function (ctx) {
  if (ctx.state.university) ctx.state.newCoursePath = ctx.router.url('courses.new', { query: { UniversityId: ctx.state.university.id } });
  ctx.state.submitCoursePath = ctx.router.url('courses.create');
  ctx.state.showCoursePath = (course) => ctx.router.url('courses.show', { id: course.id });
  ctx.state.editCoursePath = (course) => ctx.router.url('courses.edit', { id: course.id });
  ctx.state.deleteCoursePath = (course) => ctx.router.url('courses.delete', { id: course.id });
};

module.exports.loadUniversityPaths = function (ctx) {
  ctx.state.newUniversityPath = ctx.router.url('universities.new');
  ctx.state.submitUniversityPath = ctx.router.url('universities.create');
  ctx.state.showUniversityPath = (university) => ctx.router.url('universities.show', { id: university.id });
  ctx.state.editUniversityPath = (university) => ctx.router.url('universities.edit', { id: university.id });
  ctx.state.deleteUniversityPath = (university) => ctx.router.url('universities.delete', { id: university.id });
};
