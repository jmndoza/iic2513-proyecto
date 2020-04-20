module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define('Vote', {
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[-1, 1]],
      },
    },
  }, {});

  Vote.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    Vote.belongsTo(models.User);
    Vote.belongsTo(models.Evaluation);
  };

  return Vote;
};
