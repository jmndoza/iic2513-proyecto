module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Universities', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    code: {
      type: Sequelize.TEXT,
      unique: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.TEXT,
      unique: true,
      allowNull: false,
    },
    domain: {
      type: Sequelize.TEXT,
      unique: true,
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

  down: (queryInterface) => queryInterface.dropTable('Universities'),
};
