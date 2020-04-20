module.exports = (sequelize, DataTypes) => {
  const ProfessorName = sequelize.define('ProfessorName', {
    name: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {});

  ProfessorName.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    ProfessorName.hasMany(models.Evaluation);
  };

  return ProfessorName;
};
