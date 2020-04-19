module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    role: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isIn: [['student', 'professor', 'admin']],
      },
    },
    passwordHash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {});

  User.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    User.hasMany(models.Vote);
    User.hasMany(models.Evaluation);
    User.belongsToMany(models.Course, { through: 'Teaches' });
    User.belongsToMany(models.University, { through: 'Attends' });
  };

  return User;
};
