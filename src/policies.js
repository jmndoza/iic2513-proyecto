const permissions = {
  admin: {
    all: {
      POST: true, GET: true, PATCH: true, DEL: true,
    },
    Vote: {
      all: true,
    },
    Evaluation: {
      all: true,
    },
    ProfessorName: {
      all: true,
    },
    Teaches: {
      all: true,
    },
    Course: {
      all: true,
    },
    Attends: {
      all: true,
    },
    University: {
      all: true,
    },
  },
  student: {
    Vote: {
      POST: true, GET: true, PATCH: true, DEL: true,
    },
    Evaluation: {
      POST: true, GET: true, PATCH: false, DEL: false,
    },
    ProfessorName: {
      POST: true, GET: true, PATCH: true, DEL: true,
    },
    Teaches: {
      POST: true, GET: true, PATCH: true, DEL: true,
    },
    Course: {
      POST: false, GET: true, PATCH: false, DEL: false,
    },
    Attends: {
      POST: true, GET: true, PATCH: true, DEL: true,
    },
    University: {
      POST: false, GET: true, PATCH: false, DEL: false,
    },
  },
  professor: {
    Vote: {
      POST: true, GET: true, PATCH: true, DEL: true,
    },
    Evaluation: {
      POST: true, GET: true, PATCH: true, DEL: true,
    },
    ProfessorName: {
      POST: true, GET: true, PATCH: true, DEL: true,
    },
    Teaches: {
      POST: true, GET: true, PATCH: true, DEL: true,
    },
    Course: {
      POST: true, GET: true, PATCH: true, DEL: true,
    },
    Attends: {
      POST: true, GET: true, PATCH: true, DEL: true,
    },
    University: {
      POST: true, GET: true, PATCH: true, DEL: true,
    },
  },
};

module.exports.getPermissions = (role, model) => {
  if (role in permissions) {
    if ('all' in permissions[role]) {
      return permissions[role].all;
    } else if (model in permissions[role]) {
      return permissions[role][model];
    }
  }
  return {
    POST: false, GET: true, PATCH: false, DEL: false,
  };
};

module.exports.isAllow = (role, model, method) => {
  let myPermissions = {
    POST: false, GET: true, PATCH: false, DEL: false,
  };
  if (role in permissions) {
    if ('all' in permissions[role]) {
      myPermissions = permissions[role].all;
    } else if (model in permissions[role]) {
      myPermissions = permissions[role][model];
    }
  } else {
    myPermissions = {
      POST: false, GET: true, PATCH: false, DEL: false,
    };
  }

  if ('all' in myPermissions) {
    return myPermissions.all;
  } else if (method in myPermissions) {
    return myPermissions[method];
  }
  return false;
};
