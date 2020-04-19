module.exports = (sequelize, DataTypes) => {
  const University = sequelize.define('University', {
    code: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    domain: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
  }, {});

  University.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    University.belongsToMany(models.User, { through: 'Attends' });
    University.hasMany(models.Course);
  };

  return University;
};
