module.exports = (sequelize, DataTypes) => {
  const Evaluation = sequelize.define('Evaluation', {
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1900,
        max: new Date().getFullYear(),
      },
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 2,
      },
    },
    timeRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    difficultyRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    response: {
      type: DataTypes.TEXT,
    },
  }, {});

  Evaluation.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    Evaluation.hasMany(models.Vote);
    Evaluation.belongsTo(models.ProfessorName);
    Evaluation.belongsTo(models.User);
    Evaluation.belongsTo(models.Course);
  };

  return Evaluation;
};
