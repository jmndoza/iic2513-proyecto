const bcrypt = require('bcrypt');
const faker = require('faker');

const PASSWORD_SALT = 10;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ProfessorNames', [
      {
        name: 'Gabriel Vidal',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Juan Reutter',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cristian Ruz',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Hernan Cabrera',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jose Torres',
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Roberto Gonzalez',
        email: 'rgonzales@uc.cl',
        emailVerified: true,
        blocked: false,
        verified: true,
        role: 'professor',
        password: bcrypt.hashSync('pass', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pablo Pinto',
        email: 'ppinto@uc.cl',
        emailVerified: true,
        blocked: false,
        verified: true,
        role: 'professor',
        password: bcrypt.hashSync('pass', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Juan Perez',
        email: 'jperez@uc.cl',
        emailVerified: true,
        blocked: false,
        verified: true,
        role: 'student',
        password: bcrypt.hashSync('pass', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Javiera Guzman',
        email: 'jguzman@uc.cl',
        emailVerified: true,
        blocked: false,
        verified: true,
        role: 'student',
        password: bcrypt.hashSync('pass', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Camila Garrido',
        email: 'cgarrido@uc.cl',
        emailVerified: true,
        blocked: false,
        verified: true,
        role: 'student',
        password: bcrypt.hashSync('pass', PASSWORD_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Daniela Gonzalez',
        email: 'dgonzales@uc.cl',
        emailVerified: true,
        blocked: false,
        verified: true,
        role: 'admin',
        password: bcrypt.hashSync('pass', PASSWORD_SALT),
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
      {
        code: 'USACH',
        name: 'Universidad de Santiago de Chile',
        domain: 'usach.cl',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'UCH',
        name: 'Universidad de Chile',
        domain: 'uchile.cl',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    const professorName = (await queryInterface.sequelize.query('SELECT * from "ProfessorNames";'))[0];
    const professor = (await queryInterface.sequelize.query('SELECT * FROM "Users" WHERE role=\'professor\';'))[0];
    const student = (await queryInterface.sequelize.query('SELECT * FROM "Users" WHERE role=\'student\';'))[0];
    const university = (await queryInterface.sequelize.query('SELECT * from "Universities";'))[0];

    await queryInterface.bulkInsert('Courses', [
      {
        UniversityId: university[0].id,
        code: 'IIC2513',
        name: 'Tecnologías y Aplicaciones Web',
        verified: true,
        description: 'bla bla bla',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UniversityId: university[0].id,
        code: 'ICS1113',
        name: 'Optimización',
        verified: true,
        description: 'bla bla bla',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UniversityId: university[0].id,
        code: 'IIC1253',
        name: 'Matemáticas Discretas',
        verified: true,
        description: 'bla bla bla',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UniversityId: university[0].id,
        code: 'IIC2613',
        name: 'Inteligencia Artificial',
        verified: true,
        description: 'bla bla bla',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    const course = (await queryInterface.sequelize.query('SELECT * from "Courses";'))[0];

    await queryInterface.bulkInsert('Evaluations', [
      {
        UserId: student[0].id,
        CourseId: course[0].id,
        ProfessorNameId: professorName[0].id,
        comment: 'me gusta el curso',
        year: 2020,
        semester: 1,
        timeRating: 5,
        difficultyRating: 3,
        response: 'Esta es la respuesta del profe',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: student[1].id,
        CourseId: course[1].id,
        ProfessorNameId: professorName[1].id,
        comment: 'interesante el ramo',
        year: 2020,
        semester: 2,
        timeRating: 4,
        difficultyRating: 2,
        response: 'respuesta del profe',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: student[0].id,
        CourseId: course[2].id,
        ProfessorNameId: professorName[2].id,
        comment: 'ramo util',
        year: 2019,
        semester: 2,
        timeRating: 2,
        difficultyRating: 4,
        response: 'esta es la respuesta de un profe',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    const evaluation = (await queryInterface.sequelize.query('SELECT * from "Evaluations";'))[0];

    await queryInterface.bulkInsert('Votes', [
      {
        UserId: student[0].id,
        EvaluationId: evaluation[0].id,
        value: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    const vote = (await queryInterface.sequelize.query('SELECT * from "Votes";'))[0];

    await queryInterface.bulkInsert('Teaches', [
      {
        UserId: professor[0].id,
        CourseId: course[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: professor[1].id,
        CourseId: course[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});

    return queryInterface.bulkInsert('Attends', [
      {
        UserId: student[0].id,
        UniversityId: university[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: student[1].id,
        UniversityId: university[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        UserId: student[2].id,
        UniversityId: university[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Attends', null, {});
    await queryInterface.bulkDelete('Teaches', null, {});
    await queryInterface.bulkDelete('Votes', null, {});
    await queryInterface.bulkDelete('Evaluations', null, {});
    await queryInterface.bulkDelete('Courses', null, {});
    await queryInterface.bulkDelete('Universities', null, {});
    await queryInterface.bulkDelete('Users', null, {});
    return queryInterface.bulkDelete('ProfessorNames', null, {});
  },
};
