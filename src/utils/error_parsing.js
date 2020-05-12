/* eslint-disable no-else-return */
/* eslint-disable func-names */
module.exports.errorToStringArray = function (error) {
  console.error(error);
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
