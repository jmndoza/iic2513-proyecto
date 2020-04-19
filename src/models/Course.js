module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    code: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {});

  Course.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    Course.belongsToMany(models.User, { through: 'Teaches' });
    Course.belongsTo(models.University);
    Course.hasMany(models.Evaluations);
  };

  return Course;
};
