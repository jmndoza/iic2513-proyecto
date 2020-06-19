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
      validate: {
        is: {
          args: /[a-z0-9]+[a-z0-9-]*[a-z0-9]+\.[a-z0-9]{2,}/,
          msg: 'Invalid domain format',
        },
      },
    },
    img: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {});

  University.associate = function associate(models) {
    // associations can be defined here. This method receives a models parameter.
    University.belongsToMany(models.User, { through: 'Attends' });
    University.hasMany(models.Course);
  };

  return University;
};
