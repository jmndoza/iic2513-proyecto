module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Evaluations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
      allowNull: false,
      unique: 'uniqueEvaluation',
    },
    courseId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'Courses',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
      allowNull: false,
      unique: 'uniqueEvaluation',
    },
    professorNameId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'ProfessorNames',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
      allowNull: false,
      unique: 'uniqueEvaluation',
    },

    comment: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    semester: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    timeRating: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    difficultyRating: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    response: {
      type: Sequelize.TEXT,
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('Evaluations'),
};
