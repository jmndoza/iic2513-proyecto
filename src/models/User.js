const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

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
    img: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sessionId: {
      type: DataTypes.TEXT,
      unique: true,
    },
    accessToken: {
      type: DataTypes.TEXT,
      unique: true,
    },
  }, {});

  User.beforeSave(buildPasswordHash);

  User.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  User.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    User.hasMany(models.Vote);
    User.hasMany(models.Evaluation);
    User.belongsToMany(models.Course, { through: 'Teaches' });
    User.belongsToMany(models.University, { through: 'Attends' });
  };

  return User;
};
