module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    email: {
      type: Sequelize.TEXT,
      unique: true,
      allowNull: false,
    },
    emailVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    blocked: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    role: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    passwordHash: {
      type: Sequelize.TEXT,
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

  down: (queryInterface) => queryInterface.dropTable('Users'),
};
