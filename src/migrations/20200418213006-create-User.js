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
    img: {
      type: Sequelize.TEXT,
      allowNull: true,
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
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    sessionId: {
      type: Sequelize.TEXT,
      unique: true,
    },
    accessToken: {
      type: Sequelize.TEXT,
      unique: true,
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
