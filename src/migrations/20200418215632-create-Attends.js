module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Attends', {
    userId: {
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
    universityId: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Universities',
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

  down: (queryInterface) => queryInterface.dropTable('Attends'),
};
