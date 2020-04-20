module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Teaches', {
    UserId: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
      allowNull: false,
    },
    CourseId: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Courses',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
      allowNull: false,
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

  down: (queryInterface) => queryInterface.dropTable('Teaches'),
};
