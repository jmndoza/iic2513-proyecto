module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ProfessorNames', [
      {
        name: 'Juan Gonzalez',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Daniel Professor',
        email: 'daniel@uc.cl',
        emailVerified: true,
        blocked: false,
        verified: true,
        role: 'professor',
        passwordHash: 'asdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Juan Estudiante',
        email: 'juan@uc.cl',
        emailVerified: true,
        blocked: false,
        verified: true,
        role: 'student',
        passwordHash: 'asdf',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    await queryInterface.bulkInsert('Universities', [
      {
        code: 'PUC',
        name: 'Pontificia Universidad Catolica de Chile',
        domain: 'uc.cl',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    const professorName = (await queryInterface.sequelize.query('SELECT * from "ProfessorNames";'))[0][0];
    const professor = (await queryInterface.sequelize.query('SELECT * FROM "Users" WHERE role=\'professor\';'))[0][0];
    const student = (await queryInterface.sequelize.query('SELECT * FROM "Users" WHERE role=\'student\';'))[0][0];
    const university = (await queryInterface.sequelize.query('SELECT * from "Universities";'))[0][0];

    await queryInterface.bulkInsert('Courses', [
      {
        UniversityId: university.id,
        code: 'iic2513',
        name: 'Tecnologías y Aplicaciones Web',
        verified: true,
        description: 'bla bla bla',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    const course = (await queryInterface.sequelize.query('SELECT * from "Courses";'))[0][0];

    await queryInterface.bulkInsert('Evaluations', [
      {
        UserId: student.id,
        CourseId: course.id,
        ProfessorNameId: professorName.id,
        comment: 'comment hey hey',
        year: 2020,
        semester: 1,
        timeRating: 5,
        difficultyRating: 3,
        response: 'this is a response',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    const evaluation = (await queryInterface.sequelize.query('SELECT * from "Evaluations";'))[0][0];

    await queryInterface.bulkInsert('Votes', [
      {
        UserId: student.id,
        EvaluationId: evaluation.id,
        value: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    const vote = (await queryInterface.sequelize.query('SELECT * from "Votes";'))[0][0];

    await queryInterface.bulkInsert('Teaches', [
      {
        UserId: professor.id,
        CourseId: course.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    return queryInterface.bulkInsert('Attends', [
      {
        UserId: student.id,
        UniversityId: university.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('ProfessorNames', null, {});
    return queryInterface.bulkDelete('Universities', null, {});
  },
};
